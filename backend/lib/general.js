"use-strict";
const dateFns = require("date-fns");
// const knex = require("../config/knex");

/**
 * @returns current yearMonth string (YYYY-MM)
 */
exports.currentYearMonth = () => {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    if (currentMonth.length === 1) currentMonth = "0" + currentMonth;
    let currentYear = currentDate.getFullYear();
    //Concatenate year and month
    let dateQueryString = currentYear + "-" + currentMonth;
    return dateQueryString;
};

/**
 * @param {string} requestedYearMonth
 * @returns - requested month phase
 * @todo make separate columns for month and year in datbase months table
 *  Phases:
 *  1 - Reservations
 *  2 - Approval
 *  3 - Approved/Review
 *  4 - Current
 *  5 - Past
 *  6 - Not avaible
 */
exports.monthInPhase = (requestedYearMonth) => {
    let monthPhase = {};
    //Get current date
    let now = new Date();
    //Set helper dates, fun fun fun
    let requestedStart = dateFns.parseISO(requestedYearMonth + "01");           //console.log(requestedStart+" rs");
    let currentMonthStart = dateFns.addHours(dateFns.startOfMonth(now), 0);    //console.log(currentMonthStart+" cms");
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
        if (dateFns.isWithinInterval(now, { start: currentMonthStart, end: currentMonth15th })) {
            monthPhase.phase = "reservations";
        } else if ((dateFns.isAfter(now, currentMonth15th)) && (dateFns.isBefore(now, currentMonth20th))) {
            monthPhase.phase = "approval";
        } else if ((dateFns.isAfter(now, currentMonth20th)) && (dateFns.isBefore(now, currentPlusOneMonth))) {
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