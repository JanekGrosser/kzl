"use-strict";
//TODO unify integer/string in values when diffrent types need to be compared 
const knex = require("../config/knex");
const general = require("./general");
const sms = require("./sms");

/**
 * @async - get shifts count for requested division, month and role
 * @returns res -response object and data
 * @param {object} req
 * @param {object} req.query
 * @param {number} req.query.role_id
 * @param {number} req.query.month_id
 * @param {number} req.query.subdivision_id
 */
exports.getShiftsCount = async (req, res) =>{
    try {
        if (!(req.query.role_id && req.query.month_id && req.query.subdivision_id)) return res.status(400).json({error: "check query params"})
        let roleId = req.query.role_id;
        let monthId = req.query.month_id;
        let subdivisionId = req.query.subdivision_id;
        let count = await knex("division_shifts_view")
            .count("shift_id", {as: "shifts_count"})
            .select("day_number", "shift_id")
            .where("user_subdivisions", "like", "%" + subdivisionId+"%")
            .andWhere({ month_id: monthId, role_id: roleId})
            .whereNotIn("status_id", [0,1,4,7,9])
            .groupBy("day_number", "shift_id")
            .orderBy("day_number", "shift_id");
        return res.status(200).json(count);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};


/**
 * @async - Get selected user shifts calendar for the current month 
 * @returns - Api server response and requested shifts data ordered by month and shift id
 * @param {object} req
 * @param {object} req.params
 * @param {number} req.params.user_id
 * @param {object} res
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
 * @param {object} req
 * @param {object} req.params
 * @param {object} req.params.user_id
 * @param {object} req.query
 * @param {object} req.query.month_id
 * @param {object} res
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
 * @todo wrap all save callendar functions into one, only with diffrent middleware and routes (if possible)
 * @todo more validation
 * @param {object} req
 * @param {object} req.body
 * @param {json} req.body.shifts
 * @param {object} req.params
 * @param {number} req.params.user_id
 * @param {object} res
 */
exports.editCurrentCalendar = async (req, res) => { 
    try {
        //Check request params 
        if (!req.body.shifts) {
            return res.status(400).json({ error: "Check reqest params" })
        };
        let userId = req.params.user_id;
        const { shifts } = req.body;
        console.log("***" + userId + ", " + shifts[0].user_id)
        if (userId !== shifts[0].user_id) return res.status(400).json({error:"request data and user IDs are diffrent"});
        let monthId = shifts[0].month_id;
        let trx = await knex.transaction();
        await trx("man_shifts")
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
                // trx.rollback();// change to commit afer test
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
 * @async - Save calendar in reservation phase
 * @returns - Api server response
 * @todo - Better validation
 * @param {object} req
 * @param {object} req.body
 * @param {JSON} req.body.shifts
 * @param {number} req.params.user_id
 * @param {object} res
 */

exports.saveUsersCalendars = async (req, res) => {
    try {
        //Check request params
        if(!req.body.shifts) {
            return res.status(400).json({error:"Check reqest params"})
        };
        let userId = req.params.user_id;
        const {shifts} = req.body;
        let monthId  = shifts[0].month_id;
        let statusId = shifts[0].status_id;
        let now = new Date();
        let trx = await knex.transaction();
        await trx("man_shifts")
        .where({ user_id: userId }).andWhere({ month_id: monthId})
        .del()
        .catch((err) =>{
            trx.rollback();
            throw Error(err);
        });
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
 * @returns - Api server response and sends SMS on approved statuses
 * @todo better validation
 * @param {object} req
 * @param {object} req.body
 * @param {JSON} req.body.shifts
 * @param {Objcet} req.params
 * @param {number} req.params.user_id
 * @param {object} res
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
 
        //Start transaction
        let trx = await knex.transaction();
        //Delete all in range then insert new, rollback on error
        await trx("man_shifts")
            .where({ user_id: userId }).andWhere({ month_id: monthId })
            .del()
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
        await trx("man_shifts")
            .insert(shifts)
            .then(() => {
                trx.commit();        
                //Check for approve and approve-added/removed status to determine if/what SMS should be sent
                let approve = shifts.filter(shift => {
                    return (shift.status_id == 5)
                });
                let changed = shifts.filter(shift => {
                    return (shift.status_id == 6 || shift.status_id == 7)
                });
                console.log(`Shifts approved: ${approve.length}`);
                console.log(`Shifts changed: ${changed.length}`);
                if ((approve.length > 0) && (changed.length > 0)) {
                    sms.sendSms(userId, "Zatwierdzono grafik ze zmiananmi");
                } else if (approve.length > 0) {
                    sms.sendSms(userId, "Zatwierdzono grafik bez zmian");
                };      
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
 * @async - Get day summary calendar for specific subdivision
 * @returns - Api server response and data
 * @param {object} req
 * @param {object} req.params
 * @param {number} req.params.subdivision_id
 * @param {object} req.query
 * @param {number} req.query.monthId
 * @param {number} req.query.dayNumber
 * @param {object} res
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
        .whereNot({ status_id: 1 })
        .andWhere({month_id: MonthId , day_number: dayNumber})
        .andWhere({role_id: roleId})
        .whereIn("man_shifts.user_id", knex.select("users_view.user_id").from("users_view").where("users_view.user_subdivisions", "like", "%" + subdivisionId +"%"));
        return res.status(200).json(daySummary);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

/**
 * @async - Function save changes made in summary calendar view
 * @todo better validation
 * @param {object} req
 * @param {nubmer} req.body.shifts.user_id
 * @param {number} req.body.shifts.month_id
 * @param {number} req.body.shifts.day_number
 * @param {number} req.body.shifts.shift_id
 * @param {number} req.body.shifts.status_id
 * @param {number} req.query.monthId
 * @param {number} req.query.dayNumber
 * @param {object} res
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
        await trx("man_shifts")
            .where({ day_number: dayNumber }).andWhere({ month_id: monthId }).whereIn("user_id", userIds)
            .del()
            .catch((err) => {
                trx.rollback();
                throw Error(err);
            });
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


