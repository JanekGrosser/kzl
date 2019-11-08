"use-strict";
const cron = require("node-schedule");
const general = require("./general");


/**
 * Cron test function
 */
exports.cronTest = ()=>{
    cron.scheduleJob("20 * * * *", () => {
        let now = new Date();
        let stamp = now/1000;
        console.log(now);
        console.log(stamp);
        console.log(general.monthInPhase("2019-11"))
    });
};
