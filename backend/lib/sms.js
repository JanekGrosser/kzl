const Nexmo = require("nexmo");
const knex = require("../config/knex");
const config = require("../config/config");
const nexmo = new Nexmo({
    apiKey: config.nexmo.apiKey,
    apiSecret: config.nexmo.apiSecret
}, { debug: true });


/**
 * Function to send sms to specific user
 * @param {number} userId - userId
 * @param {string} message - message text
 * @todo Currently SMS disabled, just console logs. Enable SMS when ready
 */
exports.sendSms = async (userId, message) => {
    try {
        let phoneNumber = await knex("users").first("phone_num").where({ user_id: userId });
        console.log(`Sending SMS to number: ${phoneNumber.phone_num}, message: ${message}`);
        // nexmo.message.sendSms("NetInser", "+48" + phoneNumber.phone_num, message);
    } catch(error) {
        console.log(error);
    };
};
