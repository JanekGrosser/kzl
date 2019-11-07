
"use-strict";
const knex = require("../config/knex");
const general = require("./general");
//####DICTIONARY TABLES API####
//TODO move to separate file

exports.getSubdivisionsDictionary = async (req, res) => {
    try {
        let subdivisionIds = res.locals.payload.user_subdivisions.split(", ");
        let role = res.locals.payload.role;
        let subdivisions = await knex("subdivisions")
            .select()
            .modify((queryBuilder)=>{
                if (role !== "adm") {
                    queryBuilder.whereIn("subdivision_id", subdivisionIds);
                }
            });
        return res.status(200).json(subdivisions);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getRolesDictionary = async (req, res) => {
    try {
        const roles = await knex("roles").select();
        return res.status(200).json(roles);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getShiftsDictionary = async (req, res) => {
    try {
        const shifts = await knex("shifts").select();
        return res.status(200).json(shifts);

    } catch (error) {
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
        let dateQueryString = general.currentYearMonth();
        const months = await knex("months").first().where({ year_month: dateQueryString });
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getFollowingMonths = async (req, res) => {
    try {
        let dateQueryString = general.currentYearMonth();
        const months = await knex("months").select().where("year_month", ">", dateQueryString).limit(5).orderBy("month_id");
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async Function returns requested months current phase
 * @returns {object} res - response object
 * Phases:
 *  1 - Reservations
 *  2 - Approval
 *  3 - Approved/Review
 *  4 - Current
 *  5 - Past
 *  6 - Not avaible
 * @param {object} req - Request object
 * @param {object} req.query Request query
 * @param {number} req.query.month_id - requested month id
 */
exports.getMonthsPhase = async (req, res) => {
    try {
        if (!req.query.month_id) return res.status(400).json({error: "Check query param"})
        let monthId = req.query.month_id;
        let month = await knex("months").first().where({month_id: monthId});
        if (!month) return res.status(404).json({error: "Month id not found"});
        return res.status(200).json(general.monthInPhase(month.year_month));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
