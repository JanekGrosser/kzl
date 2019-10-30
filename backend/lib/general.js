/**
 * @function
 * @returns current yearMonth string (YYYY-M(M))
 * @todo add folowing zero in days
 */
exports.currentYearMonth = () => {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    //Concatenate year and month
    let dateQueryString = currentYear + "-" + currentMonth;
    return dateQueryString;
};
