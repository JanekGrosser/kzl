"use-strict";
//TODO add validator
//TODO check to ensure not blocking the Event Loop -- So far soo good

const bcrypt = require("bcrypt");
const validate = require("validator"); 
const knex = require("../config/knex");
const saltRounds = 10;

/**
 * @async - Gets all users list
 * TODO add subdivisions parameter and query
 */
exports.listAll = async (req, res) => {
    try{
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
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - gets one user
 */
exports.getUser = async (req, res) => {
    try {
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
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - remove user form DB
 */
exports.deleteUser = async (req, res) => {
    try{
        const id = req.params.user_id;
        const user = await knex("users")
            .where({ user_id: id })
            .del();
        if (user > 0) {
            return res.status(200).send(`User id: ${id} removed`);
        } else {
            return res.status(404).send(`User id ${id} not found`);
        };
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

/**
 * @async - creates new user in DB
 * Those next two functions are..
 * TODO refactor this
 * Anyway, it works
 */
exports.newUser = async (req, res) => {
    try {
        let newUserId;
        //Assign body values to local constans
        const {
            username_csr,
            password,
            first_name,
            last_name,
            phone_num,
            subdivision_id,
            role_id, 
            active
        } = req.body;
        //Check if all values were sent, response 400 if not
        if (!(req.body.username_csr 
            && req.body.password 
            && req.body.first_name 
            && req.body.last_name 
            && req.body.phone_num 
            && req.body.subdivision_id
            && req.body.role_id
            && req.body.active)) {
                return res.status(400).json({error: "Check request params"});
        };
        //Validate inputs
        let validateCsr = validate.isLength(username_csr, {min:3, max: 3});
        let validatePassword = validate.isLength(password, {min:3, max: 20});
        let validateFirstName = validate.isLength(first_name, {min:2, max: 40});
        let validateLastName = validate.isLength(last_name, {min:2, max: 40});
        let validatePhoneNum = validate.isMobilePhone(phone_num + '', "pl-PL");
        let validateSubdivision = validate.isNumeric(subdivision_id +'', {min: 1, max: 128});
        let validateRoleId = validate.isNumeric(role_id + '', {min: 1, max: 128});
        let validateActive = validate.isNumeric(active + '', {min: 0, max: 1});

        //Array constains invalid inputs names
        let invalidInputs = [];

        if (!validateCsr) invalidInputs.push("username_csr");
        if (!validatePassword) invalidInputs.push("password");
        if (!validateFirstName) invalidInputs.push("first_name");
        if (!validateLastName) invalidInputs.push("last_name");
        if (!validatePhoneNum) invalidInputs.push("phone_num");
        if (!validateSubdivision) invalidInputs.push("subdivision_id");
        if (!validateRoleId) invalidInputs.push("role_id");
        if (!validateActive) invalidInputs.push("active");

        //If any invalid inputs, return 400
        if (invalidInputs.length>0) return res.status(400).json({invalidInputs: invalidInputs});

        //Hash password
        const hash = await bcrypt.hash(password, saltRounds);
        //Insert values to users table
        await knex("users")
        .insert({ username_csr, first_name, last_name, phone_num, active, hash, role_id })
        //Then get new user ID
        .then(async ()=>{
            await knex("users")
            .first("user_id")
            .where({ username_csr: username_csr})
            //Then insert subdivisions to users_subdivision join table
            .then(async (id)=>{
                newUserId = id.user_id;
                //Check if there is more than one subdivision value
                if (subdivision_id.length > 1) {
                    //TODO change to expect array input!!************************************
                    //Convert string into array
                    let subdivisionsIdsArray = subdivision_id.split(",");
                    let insertQueryArray = [];
                    let usersSubdivisions;
                    //Make query obcjects based on array
                    subdivisionsIdsArray.forEach(element => {
                        usersSubdivisions = {};
                        usersSubdivisions.users_user_id = id.user_id;
                        usersSubdivisions.subdivisions_subdivision_id = element;
                        insertQueryArray.push(usersSubdivisions);
                    });
                    //Finally insert
                    await knex("users_subdivisions").insert(insertQueryArray);
                } else {
                    //Or if just one subdivision just insert values
                    let insertQuery = { users_user_id: id.user_id, subdivisions_subdivision_id: subdivision_id };
                    await knex("users_subdivisions").insert(insertQuery);
                };
            });
        });
        return res.status(201).json({ message: "User created", newUserId: newUserId});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
        
    };
};

/**
 * @async update user data in db
 */
exports.editUser = async (req, res) => {
    try {
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
                return res.status(400).json({error: "Check request params"});
        };
        //TODO VALIDATION
        //Validate inputs
        let validateCsr = validate.isLength(username_csr, { min: 3, max: 3 });
        let validateFirstName = validate.isLength(first_name, { min: 2, max: 40 });
        let validateLastName = validate.isLength(first_name, { min: 2, max: 40 });
        let validatePhoneNum = validate.isMobilePhone(phone_num + '', "pl-PL");
        let validateSubdivision = validate.isNumeric(subdivision_id + '', { min: 1, max: 128 });
        let validateRoleId = validate.isNumeric(role_id + '', { min: 1, max: 128 });
        let validateActive = validate.isNumeric(active + '', { min: 0, max: 1 });

        //Array constains invalid inputs names
        let invalidInputs = [];

        if (!validateCsr) invalidInputs.push("username_csr");
        if (!validateFirstName) invalidInputs.push("first_name");
        if (!validateLastName) invalidInputs.push("last_name");
        if (!validatePhoneNum) invalidInputs.push("phone_num");
        if (!validateSubdivision) invalidInputs.push("subdivision_id");
        if (!validateRoleId) invalidInputs.push("role_id");
        if (!validateActive) invalidInputs.push("active");
        //If any invalid inputs, return 400
        if (invalidInputs.length > 0) return res.status(400).json({ invalidInputs: invalidInputs });
        //Assign sent values to objects to use in query
        let user = {};
        user.username_csr = username_csr;
        user.first_name = first_name;
        user.last_name = last_name;
        user.phone_num = phone_num;
        user.role_id = role_id;
        user.active = active;
        
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
                    //Generate an array wich is passed as query to insert multiple rows into join table
                    //TODO Change to accept array input!!*****************************
                    let subdivisionsIdsArray = subdivision_id.split(",");
                    let insertQueryArray = [];
                    let usersSubdivisions;
                    subdivisionsIdsArray.forEach(element => {
                        usersSubdivisions = {};
                        usersSubdivisions.users_user_id = id;
                        usersSubdivisions.subdivisions_subdivision_id = element;
                        insertQueryArray.push(usersSubdivisions)
                    });
                    //Insert multiple divisions
                    await knex("users_subdivisions").insert(insertQueryArray);
                } else {
                    //Insert one division
                    await knex("users_subdivisions").insert({users_user_id:id, subdivisions_subdivision_id: subdivision_id})
                };
            });
        //If ok send 201 and JSON with details
        if (updatedUser > 0) {
            return res.status(201).json({message: "User updated", updatedUserId: id});
        } else {
        //When there is no maching user in DB update variable will be set false, then return 404 response
            return res.status(404).json({error: "User not found"});
        };
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
