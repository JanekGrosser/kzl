"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("../config/config");
const knex = require("../config/knex");
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
    let username = req.params.username_csr;
    let standardPassword = config.standardPassword;
    let hash = await bcrypt.hashSync(standardPassword, saltRounds);

    let user = await knex("user")
    .where({ username_csr: username })
    .first()
    .update({ hash: hash});
    if (user > 0){
        res.status(200).send(`Password for user ${username} has been reset`);
    } else {
        res.status(404).send(`User ${username} not found`);
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

