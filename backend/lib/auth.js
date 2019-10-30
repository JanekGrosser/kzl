"use-strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generator = require("generate-password");
const Nexmo = require("nexmo");
const validate = require("validator");

const config = require("../config/config");
const knex = require("../config/knex");
const saltRounds = 10;

const nexmo = new Nexmo({
    apiKey: config.nexmo.apiKey,
    apiSecret: config.nexmo.apiSecret
}, {debug: true})

/**
 * @async Function checks if provided password matches hashed password in DB
 * @rerurns server resonse, and on succes a signed JWT token
 */
exports.login = async (req, res) => {
    try {
        let { username_csr, password } = req.body;
        //Check if all input parameters are sent
        if (!(username_csr && password)) {
            return res.status(400).json({error: "Missing request params"});
        };
        //Input format validation
        let validateCsr = validate.isLength(username_csr, { min: 3, max: 3 });
        let validatePassword = validate.isLength(password, {min:3, max: 20});
        
        let invalidInputs = [];

        if (!validateCsr) invalidInputs.push("username_csr");
        if (!validatePassword) invalidInputs.push("password");

        if (invalidInputs.length > 0) return res.status(400).json({ invalidInputs: invalidInputs });
        //Fetch user object with hash from DB
        const user = await knex("users_auth_view")
            .where({ username_csr })
            .first(
                "user_id",
                "username_csr",
                "first_name",
                "last_name",
                "phone_num",
                "user_subdivisions",
                "role",
                "role_id",
                "active",
                "hash");
        //Send 401 if no user found
        if (!user) {
            return res.status(401).json({error: "User not found"});
        };
        //Send 401 if password doesn't match
        const passwordIsValid = await bcrypt.compare(password, user.hash);
        if (!passwordIsValid) {
            return res.status(401).json({error: "Wrong password"});
        };
        if (user.active === 0){
            console.log(user.active);
            return res.status(403).json({error: "Account disabled"})
        };
        //Pupulate, sign and send JWT token wiht user data
        const jwtPayload = {
            id: user.user_id,
            username: user.username_csr,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            role_id: user.role_id,
            user_subdivisions: user.user_subdivisions
        };
        const token = jwt.sign(jwtPayload, config.jwtSecret);
        res.status(200).json(token);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - generate new user apssword and send it to users mobile phone number
 */
exports.resetPassword = async (req, res) => {
    try{
        let username = req.params.username_csr; // TODO check if parameter is sent
        //Validate input
        let validateCsr = validate.isLength(username, { min: 3, max: 3 });
        if (!validateCsr) return res.status(400).json({ error: "Bad CSR format" });
        //Fetch users object form DB
        const user = await knex("users")
            .first("phone_num", "user_id", "username_csr")
            .where({ username_csr: username });
        //If user is found, generate, hash and update new password, then send it via Nexmo SMS gate to mobile number
        if (user) {
            let newPassword = await generator.generate({ length: 5, numbers: true }); // TODO make stronger for poroduction
            let hash = await bcrypt.hashSync(newPassword, saltRounds);
            const updated = await knex("users")
                .where({ username_csr: username })
                .first()
                .update({ hash: hash });
            if (updated > 0) {
                nexmo.message.sendSms("NetInser", "+48" + user.phone_num, newPassword);
                return res.status(200).json({message: "New password sent"});
            } else {
                return res.status(404).json({error: "Password not updated"});
            };
        //If no user found, send 404
        } else {
            return res.status(404).json({ error: "User not found"});
        };
    } catch (error){
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - sets a new password from input
 */
exports.newPassword = async (req, res) => {
    try {
        const id = req.params.user_id;
        const { password, newPassword } = req.body;
        //Check if all input parameters are sent
        if (!(password && newPassword)) {
            return res.status(400).send("Request body params missing");
        };
        //Input validation
        let validatePassword = validate.isLength(password, { min: 3, max: 20 });
        let validateNewPassword = validate.isLength(newPassword, { min: 3, max: 20 });
        if (!validatePassword) {
            return res.status(400).json({ error: "Bad password format" });
        } else if (!validateNewPassword) {
            return res.status(400).json({ error: "Bad new password format" });
        };
        //Fetch user object from DB
        const user = await knex("users")
            .where({ user_id: id })
            .first();
        //If found, check current password
        if (user) {
            const passwordIsValid = await bcrypt.compareSync(password, user.hash);
            //If password matches, hash new password and update in DB
            if (passwordIsValid) {
                const hash = bcrypt.hashSync(newPassword, saltRounds);
                await knex("users")
                    .where({ user_id: id })
                    .update({ hash: hash });
                return res.status(200).json({ message: "New password set" });
            } else {
                return res.status(401).json({ error: "Wrong password" });
            };
        } else {
            return res.status(404).json({ error: "User not found" });
        };
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }; 
};

