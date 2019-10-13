const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const knex = require("../knex");
const saltRounds = 10;

exports.listAll = async (req, res) => {
    const users = await knex("user");
    res.send(users);
};

exports.newUser = async (req, res) => {
    let {
        username_csr,
        password,
        first_name,
        last_name,
        phone_num,
        fp_id,
        role_id
    } = req.body;

    if (!(req.body.username_csr 
        && req.body.password 
        && req.body.first_name 
        && req.body.last_name 
        && req.body.phone_num 
        && req.body.fp_id
        && req.body.role_id
        )) {
        res.status(400).send("Check request params");
    } else {
        let hash = await bcrypt.hash(password, saltRounds);
        let active = 1;
        try {
            await knex("user").insert({ username_csr, first_name, last_name, phone_num, fp_id, active, hash, role_id });
        } catch (error) {
            res.status(400).send(error.stack);
            return;
        }
        res.status(201).send(`User ${username_csr} created`);
    };
};