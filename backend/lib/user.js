"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator
//TODO refactor to ensure not blocking the Event Loop


const bcrypt = require("bcrypt");
const knex = require("../config/knex");
const saltRounds = 10;

exports.listAll = async (req, res) => {
    const users = await knex("users_view")
        .select(
            "user_id", 
            "username_csr",
            "first_name", 
            "last_name", 
            "phone_num", 
            "user_subdivisions", 
            "role", 
            "role_id", 
            "active")
        .orderBy("user_id");
    return res.status(200).json(users);
};

exports.getUser = async (req, res) => {
    const id = req.params.user_id;
    let user = await knex("users_view")
        .where({ user_id: id })
        .first(
            "user_id", 
            "username_csr", 
            "first_name", 
            "last_name", 
            "phone_num", 
            "user_subdivisions", 
            "role", 
            "role_id", 
            "active")
    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).send(`User id ${id} not found`);
    };
};

exports.deleteUser = async (req, res) => {
    const id = req.params.user_id;
    const user = await knex("users")
        .where({ user_id: id })
        .del();
    if (user > 0) {
        return res.status(200).send(`User id: ${id} removed`);
    } else {
        return res.status(404).send(`User id ${id} not found`);
    };
};

/**
 * Those next two functions are just so horrbile
 * TODO refactor this shit
 * Anyway, it works
 */
exports.newUser = async (req, res) => {
    //Assign body values to local constans
    const {
        username_csr,
        password,
        first_name,
        last_name,
        phone_num,
        subdivision_id,
        role_id
    } = req.body;
    //Check if all values were sent, response 400 if not
    if (!(req.body.username_csr 
        && req.body.password 
        && req.body.first_name 
        && req.body.last_name 
        && req.body.phone_num 
        && req.body.subdivision_id
        && req.body.role_id)) {
            return res.status(400).send("Check request params");
    } else {


        // console.log(subdivision_id);
        const hash = await bcrypt.hash(password, saltRounds);
        let active = 1;
        try {
            await knex("users")
            .insert({ username_csr, first_name, last_name, phone_num, active, hash, role_id })
            .then(async ()=>{
                await knex("users")
                .first("user_id")
                .where({ username_csr: username_csr})
                .then(async (id)=>{
                    //Don't ask
                    if (subdivision_id.length > 1) {

                        let subdivisionsIdsArray = subdivision_id.split(",");
                        let insertQueryArray = [];
                        let usersSubdivisions;

                        subdivisionsIdsArray.forEach(element => {
                            usersSubdivisions = {};
                            usersSubdivisions.users_user_id = id.user_id;
                            usersSubdivisions.subdivisions_subdivision_id = element;
                            insertQueryArray.push(usersSubdivisions)
                        });
                        
                        await knex("users_subdivisions").insert(insertQueryArray);
                    } else {
                        let insertQuery = { users_user_id: id.user_id, subdivisions_subdivision_id: subdivision_id };
                        await knex("users_subdivisions")
                            .insert(insertQuery);
                    };       

                });
            });
        } catch (error) {
            return res.status(400).send(error.stack);
        }
        return res.status(201).send(`User ${username_csr} created`);
    };
};

exports.editUser = async (req, res) => {
    //Get id from path param
    const id = req.params.user_id;
    //Assign body values to local constans
    const {
        username_csr,
        first_name,
        last_name,
        phone_num,
        subdivision_id,
        role_id,
        active
    } = req.body;
    //Check if all values were sent, response 400 if not
    if (!(req.body.username_csr
        && req.body.first_name
        && req.body.last_name
        && req.body.phone_num
        && req.body.subdivision_id
        && req.body.role_id)) {
        return res.status(400).send("Check request params");
    } else {
        //Assign sent values to objects to use in query
        let user = {};

        user.username_csr = username_csr;
        user.first_name = first_name;
        user.last_name = last_name;
        user.phone_num = phone_num;
        user.role_id = role_id;
        user.active = active;
        
        try {
            //Send update query to DB and assign true/false update response from DB to variable
            let updatedUser = await knex("users")
                .where({ user_id:id })
                .update(user);
            //Seperate query to assosiation table
                await knex("users_subdivisions")
                .where({users_user_id: id})
                .delete()
                .then(async(ok)=>{
                    //Check if user has been assigned with more than one subdivision
                    if (subdivision_id.length > 1) {
                        //This wonderfull loop generates an awesome array wich is passed as query to insert multiple bueatiful rows into an awesome assosiation table
                        let subdivisionsIdsArray = subdivision_id.split(",");
                        let insertQueryArray = [];
                        let usersSubdivisions;
                        subdivisionsIdsArray.forEach(element => {
                            usersSubdivisions = {};
                            usersSubdivisions.users_user_id = id;
                            usersSubdivisions.subdivisions_subdivision_id = element;
                            insertQueryArray.push(usersSubdivisions)
                        });
                        await knex("users_subdivisions").insert(insertQueryArray);
                    } else {
                        await knex("users_subdivisions").insert({users_user_id:id, subdivisions_subdivision_id: subdivision_id})
                    };
                });
            //If ok send 201 and JSON with details
            if (updatedUser > 0) {
                return res.status(201).json([{ "User id:": id }, { updatedUser }, { user }]);
            } else {
            //When there is no maching user in DB update variable will be set false, then return 404 response
                return res.status(404).send(`User id ${id} not found`);
            };
        } catch (error) {
            return res.status(500).send(error.stack);
        };
    };
};