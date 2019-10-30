"use-strict";
//TODO unify integer/string in values when diffrent types need to be compared 
//TODO check to ensure not blocking the Event Loop
const knex = require("../config/knex");
const general = require("./general");


/**
 * @async - Get selected user shifts calendar for the current month 
 * @returns - Api server response and data
 */
exports.getCurrentShifts = async (req, res) => {
    try {
        let id = req.params.user_id;
        //Get current year and month
        let dateQueryString = general.currentYearMonth();
        //Get current months id
        let yearMonth = await knex("months").first().where({ year_month: dateQueryString });
        //Get requested shifts form db
        let shifts = await knex("man_shifts")
            .select("shift_id", "month_id", "day_number", "status_id")
            .where({ user_id: id })
            .andWhere({ month_id: yearMonth.month_id})
            .orderBy([{ column: "month_id" }, { column: "shift_id" }]);
        //Send shifts as response
        return res.status(200).json(shifts);   
    } catch (error){
        console.log(error);
        return res.sendStatus(500);
    };
};


/**
 * @async - Get selected user shifts callendar for selected month
 * @returns - Api server response and data
 */
exports.getUsersCalendars = async (req, res) => {
    try {
        let id = req.params.user_id;
        let monthId = req.query.month_id;
        let shifts = await knex("man_shifts")
            .select("shift_id", "month_id", "day_number", "status_id")
            .where({user_id:id})
            .andWhere({month_id: monthId})
            .orderBy([{column: "day_number"}, {column: "shift_id"}]);
        return res.status(200).json({shifts: shifts});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - Edit users current calendar
 * @returns - Api server response
 * TODO wrap all save callendar functions into one, only with diffrent middleware and routes (if possible)
 */
exports.editCurrentCalendar = async (req, res) => { 
    try {
        //Check request params 
        //TODO more request validation
        if (!req.body.shifts) {
            return res.status(400).json({ error: "Check reqest params" })
        };
        let userId = req.params.user_id;
        const { shifts } = req.body;
        console.log("***" + userId + ", " + shifts[0].user_id)
        if (userId !== shifts[0].user_id) return res.status(400).json({error:"request data and user IDs are diffrent"});
        
        //TODO VALIDATE
        // console.log(shifts);

        let monthId = shifts[0].month_id;
        let trx = await knex.transaction();
        let deleted = await trx("man_shifts")
            .where({ user_id: userId }).andWhere({ month_id: monthId })
            .del()
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
        // console.log(deleted);
        await trx("man_shifts")
            .insert(shifts)
            .then(() => {
                trx.rollback();// change to commit afer test
                // trx.commit();
                return res.status(201).json({ ok: "Need something in reponse?" });
            })
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};



/**
 * @async - Save calendar in reservation phase
 * @returns - Api server response
 */

exports.saveUsersCalendars = async (req, res) => {
    try {
        //Check request params 
        //TODO more request validation
        if(!req.body.shifts) {
            return res.status(400).json({error:"Check reqest params"})
        };
        let userId = req.params.user_id;
        const {shifts} = req.body;
        let monthId  = shifts[0].month_id;
        let statusId = shifts[0].status_id;
        let now = new Date();
        let trx = await knex.transaction();
        let deleted = await trx("man_shifts")
        .where({ user_id: userId }).andWhere({ month_id: monthId})
        .del()
        .catch((err) =>{
            trx.rollback();
            throw Error(err);
        });
        // console.log(deleted);
        if (statusId === 2) {
            await trx("approval_sent_at")
            .insert({user_id: userId, month_id: monthId, sent_at: now})
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
        }
        await trx("man_shifts")
        .insert(shifts)
        .then(()=>{
            trx.commit();
            return res.status(201).json({ ok: "Need something in reponse?" });
        })
        .catch((err) => {
            trx.rollback();
            throw Error(err);
        });
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};



/**
 * @async - Save calendar by KZ in approval phase
 * @returns - Api server response
 */

exports.saveApprovalCalendars = async (req, res) => {
    try {
        //Check request params
        if (!req.body.shifts) {
            return res.status(400).json({ error: "Check reqest params" })
        };
        let userId = req.params.user_id;
        const { shifts } = req.body;
        let monthId = shifts[0].month_id;
        //Start stransaction
        let trx = await knex.transaction();
        //Delete all in range then insert new, rollback on error
        let deleted = await trx("man_shifts")
            .where({ user_id: userId }).andWhere({ month_id: monthId })
            .del()
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
        // console.log(deleted);
        await trx("man_shifts")
            .insert(shifts)
            .then(() => {
                trx.commit();
                return res.status(201).json({ ok: "Need something in reponse?" });
            })
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};


/**
 * @async - Get day summary calendar for subdivision
 * @returns - Api server response and data
 */

exports.getDaySummary = async (req, res) => {
    try {
        let subdivisionId = req.params.subdivision_id;
        let MonthId = req.query.monthId;
        let dayNumber = req.query.dayNumber;
        let roleId = req.query.roleId;
        if (!(subdivisionId && MonthId && dayNumber && roleId)) return res.status(400).json({ error: "check request params" });
        let daySummary = await knex("man_shifts")
        .select(
            "man_shifts.user_id",
            "username_csr",
            "first_name",
            "last_name",
            "user_subdivisions",
            "role_id",
            "month_id", 
            "day_number", 
            "shift_id", 
            "status_id"
            )
        .innerJoin("users_view", "users_view.user_id", "man_shifts.user_id" )
        .where({month_id: MonthId , day_number: dayNumber})
        .andWhere({role_id: roleId})
        .whereIn("man_shifts.user_id", knex.select("users_view.user_id").from("users_view"));
        return res.status(200).json(daySummary);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

/**
 * @async - Function save changes made in summary calendar view
 * @param req 
 * @param res
 * @param req.body.shifts.user_id
 * @param req.body.shifts.month_id
 * @param req.body.shifts.day_number
 * @param req.body.shifts.shift_id
 * @param req.body.shifts.status_id
 * @param req.query.monthId
 * @param req.query.dayNumber
 * @returns api server response
 */

exports.saveSummaryCalendars = async (req, res) => {
    try {
        //Check request params
        if (!(req.body.shifts && req.query.monthId && req.query.dayNumber)) {
            return res.status(400).json({ error: "Check reqest params" })
        };

        const { shifts } = req.body;
        let monthId = req.query.monthId;
        let dayNumber = req.query.dayNumber;
        let userIds = [];
        shifts.forEach(function(shift){ 
            if (!(shift.month_id == monthId && shift.day_number == dayNumber)) {
                console.log("error!");
                throw Error("Bad request data");
            };
            userIds.push(shift.user_id);
        });
        //Start stransaction
        let trx = await knex.transaction();
        //Delete all in range then insert new, rollback on error
        let deleted = await trx("man_shifts")
            .where({ day_number: dayNumber }).andWhere({ month_id: monthId }).whereIn("user_id", userIds)
            .del()
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
        console.log(`***Deleted rows: ${deleted}`);
        await trx("man_shifts")
            .insert(shifts)
            .then(() => {
                // trx.rollback();
                trx.commit(); // 
                return res.status(201).json({ ok: "Need something in reponse?" });
            })
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};


