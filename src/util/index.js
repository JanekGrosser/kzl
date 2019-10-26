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
    }
};
