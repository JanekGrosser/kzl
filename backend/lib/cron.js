"use-strict";
const Nexmo = require("nexmo");
const knex = require("../config/knex");
const config = require("../config/config");
const cron = require("node-schedule");
const general = require("./general");

const nexmo = new Nexmo({
    apiKey: config.nexmo.apiKey,
    apiSecret: config.nexmo.apiSecret
}, { debug: true });

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

/**
 * Sets cron for 7:15 on 19th of every month
 * Checks next months phase
 * If phase is approval check if all users have their calendars approved
 * Make unapproved users array
 * Get array of unapproved users subdivisions (omg, what if have many?)
 * Get array of KZ's phone numbers from thise subdivisions
 * Send warning message to all KZ'z
 * @todo SMS disabled, enable when ready
 * @todo refactor
 */
exports.warningUnapprovedCalendars = async ()=> {
    try{
        cron.scheduleJob("30 7 19 * *", async () => {
            let dateQueryString = general.currentYearMonth();
            let nextMonth = await knex("months").select().where("year_month", ">", dateQueryString).first().orderBy("month_id");
            let nextMonthPhase = general.monthInPhase(nextMonth.year_month);
            console.log(nextMonthPhase);

            if (nextMonthPhase.phase === "approval") {
                let users = await knex("users_approval_view")
                    .select("user_id")
                    .where({ month_id: nextMonth.month_id})
                // console.log(users)
                let usersArray = [];
                users.forEach((user)=>{
                    usersArray.push(user.user_id)
                });

                let unapprovedSubdivisions = await knex("user_subdivisions_view")
                    .distinct("subdivision_id")
                    .whereIn("role_id", [2,3])
                    .whereNotIn("user_id", usersArray);
                console.log(unapprovedSubdivisions);
                let subdivisionsArray = [];
                unapprovedSubdivisions.forEach(subdivision=>{
                    subdivisionsArray.push(subdivision.subdivision_id)
                });

                let sendTo = await knex("user_subdivisions_view")
                    .distinct("phone_num", "username_csr")
                    .select("subdivision_name")
                    .where({role_id: 5})
                    .whereIn("subdivision_id", subdivisionsArray);

                sendTo.forEach(recipent=>{
                    console.log(`Send to +48${recipent.phone_num} message: Niezatwierdzone grafiki w ${recipent.subdivision_name}`)
                    // nexmo.message.sendSms("NetInser", "+48" + recipent.phone_num, `Niezatwierdzone grafiki w ${recipent.subdivision_name}`);
                })
            };

        });
    }
    catch(error){
        console.log(error);
    };
};