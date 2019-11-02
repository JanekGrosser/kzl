
"use-strict";
const dateFns = require("date-fns");
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
        //declare an object to store phase value
        
        /**
         * @function
         * @param {string} requestedYearMonth
         * @returns - requested month phase
         * @todo make separate columns for month and year in datbase months table
         * @todo aync if needed
         */
        function monthInPhase (requestedYearMonth) {
            let monthPhase = {};
            //Get current date
            let now = new Date();
            //Set helper dates, fun fun fun
            let requestedStart = dateFns.parseISO(requestedYearMonth + "01");           //console.log(requestedStart+" rs");
            let currentMonthStart = dateFns.addHours(dateFns.startOfMonth(now), 0) ;    //console.log(currentMonthStart+" cms");
            let currentMonth15th = dateFns.addDays(currentMonthStart, 14);              //console.log(currentMonth15th + " c15th");
            let currentMonth20th = dateFns.addDays(currentMonthStart, 19);              //console.log(currentMonth20th + " c20th");            
            let currentPlusSixMonths = dateFns.addMonths(currentMonthStart, 6);         //console.log(currentPlusSixMonths + " c+6");
            let currentPlusFiveMonths = dateFns.addMonths(currentMonthStart, 5);        //console.log(currentPlusFiveMonths + " c+5");
            let currentPlusOneMonth = dateFns.addMonths(currentMonthStart, 1);          //console.log(currentPlusOneMonth +" c+1");
            //more fun
            if (dateFns.isSameMonth(requestedStart, currentMonthStart)) {
                monthPhase.phase = "current";
            } else if (dateFns.isBefore(requestedStart, currentMonthStart)) {
                monthPhase.phase = "past";
            } else if (dateFns.isSameMonth(requestedStart, currentPlusOneMonth)) {
                if (dateFns.isWithinInterval (now, {start: currentMonthStart, end: currentMonth15th})) {
                    monthPhase.phase = "reservations";
                } else if ((dateFns.isAfter(now, currentMonth15th))&&(dateFns.isBefore(now, currentMonth20th))) {
                    monthPhase.phase = "approval";
                } else if ((dateFns.isAfter(now, currentMonth20th))&&(dateFns.isBefore(now, currentPlusOneMonth))) {
                    monthPhase.phase = "approved"
                } else {
                    throw Error("Unexpected date parsing error");
                };
            } else if ((dateFns.isAfter(requestedStart, currentPlusOneMonth)) && (dateFns.isBefore(requestedStart, currentPlusSixMonths))) {
                monthPhase.phase = "reservations"  //change else if to in range
            } else if (dateFns.isAfter(requestedStart, currentPlusFiveMonths)) {
                monthPhase.phase = "notAvaible"
            } else {
                throw Error("Unexpected date parsing error");
            };
            // console.log(monthPhase.phase)
            return monthPhase;
        };
        return res.status(200).json(monthInPhase(month.year_month));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
