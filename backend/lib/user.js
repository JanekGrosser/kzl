"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator

const bcrypt = require("bcrypt");
const knex = require("../config/knex");
const saltRounds = 10;

exports.listAll = async (req, res) => {
    const users = await knex("user")
        .select("user_id", "username_csr","first_name", "last_name", "phone_num", "fp_name", "roles.role", "active")
        .innerJoin("fp", "user.fp_id", "fp.fp_id")
        .innerJoin("roles", "user.role_id", "roles.role_id");
    return res.status(200).json(users);
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
        && req.body.role_id)) {
            return res.status(400).send("Check request params");
    } else {
        const hash = await bcrypt.hash(password, saltRounds);
        let active = 1;
        try {
            await knex("user").insert({ username_csr, first_name, last_name, phone_num, fp_id, active, hash, role_id });
        } catch (error) {
            return res.status(400).send(error.stack);
        }
        return res.status(201).send(`User ${username_csr} created`);
    };
};

exports.getUser = async (req, res) => {
    const id = req.params.user_id;
    let user = await knex("user")
        .where({ user_id: id })
        .first("user_id", "username_csr", "first_name", "last_name", "phone_num", "fp_name", "role", "active")
        .innerJoin("fp", "user.fp_id", "fp.fp_id")
        .innerJoin("roles", "user.role_id", "roles.role_id");
    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).send(`User id ${id} not found`);
    };
};

exports.deleteUser = async (req, res) => {
    const id = req.params.user_id;
    const user = await knex("user")
        .where({ user_id: id })
        .del();
    if (user > 0) {
        return res.status(200).send(`User id: ${id} removed`);
    } else {
        return res.status(404).send(`User id ${id} not found`);
    };
};
