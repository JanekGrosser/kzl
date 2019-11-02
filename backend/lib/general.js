/**
 * @function
 * @returns current yearMonth string (YYYY-M(M))
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
