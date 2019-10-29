export default {
    format: (str, ...args) => {
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    },
    convertMinsToHrsMins: (minutes) => {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        return h + ":" + m;
    },
    getDateFromYearMonth(yearMonthString) {
        var yearMonthStringSplit = yearMonthString.split("-");
        var year = parseInt(yearMonthStringSplit[0]);
        var month = parseInt(yearMonthStringSplit[1]);
        return new Date(year,month - 1,1);
    },
    getMonthObjectFromDate(date, months) {
        return months.find(month => {
            return month.year_month === (date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2));
        })
    },

};
