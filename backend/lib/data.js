"use-strict";

//TODO check to ensure not blocking the Event Loop
const knex = require("../config/knex");


/**
 * @async - Get selected user shifts calendar for the current month 
 */
exports.getCurrentShifts = async (req, res) => {
    try {
        let id = req.params.user_id;
        //Get current year and month
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        //Concatenate year and month
        let dateQueryString = currentYear + "-" + currentMonth;
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
        if (userId !== shifts[0].user_id) return res.status(400).json({error:"request user IDs are diffrent"});
        
        //TODO VALIDATE
        // console.log(shifts);

        let monthId = shifts[0].month_id;
        let insert = shifts.map(function (shift) {
            return shift;
        });
        let trx = await knex.transaction();
        let deleted = await trx("man_shifts")
            .where({ user_id: userId }).andWhere({ month_id: monthId })
            .del()
            .catch((err => {
                trx.rollback();
                throw Error(err);
            }));
        console.log(deleted);
        await trx("man_shifts")
            .insert(insert)
            .then(() => {
                trx.rollback();
                // trx.commit();
                return res.status(201).json({ ok: "Need something in reponse?" });
            })
            .catch((err => {
                trx.rollback();
                throw Error(err);
            }));

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};



/**
 * @async - Save calendar in reservation phase
 */

exports.saveUsersCalendars = async (req, res) => {
    try {
        console.log(res.locals)
        //Check request params 
        //TODO more request validation
        if(!req.body.shifts) {
            return res.status(400).json({error:"Check reqest params"})
        };

        let userId = req.params.user_id;
        const {shifts} = req.body;
        //TODO VALIDATE
        // console.log(shifts);

        let monthId  = shifts[0].month_id;
        let statusId = shifts[0].status_id;
        let now = new Date();
        let insert = shifts.map(function (shift) {
            // shift.user_id = userId;
            return shift;
        });
        let trx = await knex.transaction();
        let deleted = await trx("man_shifts")
        .where({ user_id: userId }).andWhere({ month_id: monthId})
        .del()
        .catch((err=>{
            trx.rollback();
            throw Error(err);
        }));
        console.log(deleted);
        if (statusId === 2) {
            await trx("approval_sent_at")
            .insert({user_id: userId, month_id: monthId, sent_at: now})
            .catch((err)=>{
                trx.rollback();
                throw Error(err);
            });
        }
        await trx("man_shifts")
        .insert(insert)
        .then(()=>{
            trx.commit();
            return res.status(201).json({ ok: "Need something in reponse?" });
        })
        .catch((err => {
            trx.rollback();
            throw Error(err);
        }));
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};



/**
 * @async - Save calendar by KZ in approval phase
 */

exports.saveApprovalCalendars = async (req, res) => {
    try {
        console.log(res.locals)
        //Check requet params
        if (!req.body.shifts) {
            return res.status(400).json({ error: "Check reqest params" })
        };

        let userId = req.params.user_id;
        const { shifts } = req.body;
        //TODO VALIDATE
        // console.log(shifts);

        let monthId = shifts[0].month_id
        let insert = shifts.map(function (shift) {
            // shift.user_id = userId;
            return shift;
        });
        let trx = await knex.transaction();
        let deleted = await trx("man_shifts")
            .where({ user_id: userId }).andWhere({ month_id: monthId })
            .del()
            .catch((err => {
                trx.rollback();
                throw Error(err);
            }));
        console.log(deleted);
        await trx("man_shifts")
            .insert(insert)
            .then(() => {
                trx.commit();
                return res.status(201).json({ ok: "Need something in reponse?" });
            })
            .catch((err => {
                trx.rollback();
                throw Error(err);
            }));

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};


//####DICTIONARY TABLES API####
//TODO move to separate file

exports.getSubdivisionsDictionary = async (req, res) => {
    try{
        const subdivisions = await knex("subdivisions").select();
        return res.status(200).json(subdivisions);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getRolesDictionary = async (req, res) => {
    try{
        const roles = await knex("roles").select();
        return res.status(200).json(roles);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getShiftsDictionary = async (req, res) => {
    try{
        const shifts = await knex("shifts").select();
        return res.status(200).json(shifts);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getStatusDictionary = async (req, res) => {
    try {
        const status = await knex("status").select();
        return res.status(200).json(status);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getMonthsDictionary = async (req, res) => {
    try {
        const months = await knex("months").select();
        return res.status(200).json(months);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getCurrentMonth = async (req, res) => {
    try {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        //Concatenate year and month
        let dateQueryString = currentYear + "-" + currentMonth;
        const months = await knex("months").first().where({year_month:dateQueryString});
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getFollowingMonths = async (req, res) => {
    try {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        //Concatenate year and month
        let dateQueryString = currentYear + "-" + currentMonth;
        const months = await knex("months").select().where("year_month", ">", dateQueryString).limit(5).orderBy("month_id");
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
/**
 * Returns current yearMonth string (YYYY-M(M))
 */
function currentYearMonth () {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    //Concatenate year and month
    let dateQueryString = currentYear + "-" + currentMonth;
    return dateQueryString;
}