"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator
//TODO refactor to ensure not blocking the Event Loop

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generator = require("generate-password");
const Nexmo = require("nexmo");

const config = require("../config/config");
const knex = require("../config/knex");
const nexmo = new Nexmo({
    apiKey: config.nexmo.apiKey,
    apiSecret: config.nexmo.apiSecret
}, {debug: true})
const saltRounds = 10;

exports.login = async (req, res) => {
    let { username_csr, password } = req.body;
    if (!(username_csr && password)) {
        res.status(400).send("Check request params");
    } else {
        const user = await knex("user")
            .where({ username_csr })
            .first("user_id", "username_csr", "first_name", "last_name", "phone_num", "fp_name", "role", "active", "hash")
            .innerJoin("fp", "user.fp_id", "fp.fp_id")
            .innerJoin("roles", "user.role_id", "roles.role_id");
        console.log(user);
        if (!user) {
            res.status(401).send(`No username ${username_csr}`);
            return;
        };

        const passwordIsValid = await bcrypt.compare(password, user.hash);
        if (!passwordIsValid) {
            res.status(401).send(`Bad password for user ${username_csr}`);
            return;
        };

        const jwtPayload = {
            id: user.user_id,
            username: user.username_csr,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            fp: user.fp_name
        };
        const token = jwt.sign(jwtPayload, config.jwtSecret);

        res.status(200).json(token);
    };
};

exports.resetPassword = async (req, res) => {
    try{
        let username = req.params.username_csr;
        const user = await knex("user")
            .first("phone_num", "user_id", "username_csr")
            .where({ username_csr: username })
        if (user) {
            let newPassword = await generator.generate({ length: 5, numbers: true }); // TODO make stronger for poroduction
            let hash = await bcrypt.hashSync(newPassword, saltRounds);
            const updated = await knex("user")
                .where({ username_csr: username })
                .first()
                .update({ hash: hash });
            if (updated > 0) {
                nexmo.message.sendSms("NetInser", "+48" + user.phone_num, newPassword);
                return res.status(200).send(`Password for user ${username} has been sent to ${user.phone_num}`);
            } else {
                return res.status(404).send(`User ${username} not found`);
            };
        } else {
            return res.status(404).send(`User not found`);
        };
    } catch (error){
        return res.status(500).send(error);
    };
};

exports.newPassword = async (req, res) => {
    const id = req.params.user_id;
    const { password, newPassword } = req.body;

    if (!(password && newPassword)) {
        return res.status(400).send("Request body params missing");
    };

    const user = await knex("user")
        .where({ user_id: id })
        .first();
    if (user) {
        const passwordIsValid = await bcrypt.compareSync(password, user.hash);
        if (passwordIsValid) {
            const hash = bcrypt.hashSync(newPassword, saltRounds);
            await knex("user")
                .where({ user_id: id })
                .update({ hash: hash });
            return res.status(200).send(`New password set for user ${id} `);
        } else {
            return res.status(401).send("Wrong password");
        };
    } else {
        return res.status(404).send("no user of that id found")
    };
};

