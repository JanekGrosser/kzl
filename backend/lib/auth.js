"use-strict";

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
            .first();
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
            role_id: user.role_id
        };
        const token = jwt.sign(jwtPayload, config.jwtSecret);

        let responseData = { token: token, displayRole: user.role_id }
        res.status(200).json(responseData);
    };
};

exports.resetPassword = async (req, res) => {
    let username = req.params.username_csr;
    console.log(username)
    let standardPassword = config.standardPassword;
    let hash = bcrypt.hashSync(standardPassword, saltRounds);

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
