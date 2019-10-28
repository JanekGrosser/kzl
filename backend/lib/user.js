"use-strict";
//TODO add validator
//Refactor more
//TODO check to ensure not blocking the Event Loop -- So far soo good

const bcrypt = require("bcrypt");
const validate = require("validator"); 
const knex = require("../config/knex");
const saltRounds = 10;


/**
 * @async - Get sorted list of users sent to approval timestamps
 */
exports.getUserApprovalTimestamp = async (req,res) => {
    try {
        if (!req.params.month_id) return res.status(400).json({error:"Check request params"});
        let monthId = req.params.month_id;
        let timestamp = await knex("approval_sent_at")
        .where({ month_id: monthId })
        .select()
        .orderBy("sent_at", "desc");
        return res.status(200).json(timestamp);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};


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
 * @async - Gets all users list in subdivision
 * T
 */
exports.listAllSubdivision = async (req, res) => {
    try{
        if(!req.params.subdivision_id) return res.status(400).json({error:"Check request param"})
        let divisionId = req.params.subdivision_id;
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
            .where("user_subdivisions", "like", "%" + divisionId+ "%")
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
            return res.status(404).json({error: "User not found"});
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
    const trx = await knex.transaction(); //TODO refactor, may throw unhandled promise rejection on db connection error, just movr rollbacks to .catch methods I guess and then catch block can only handle non transaction related errors
    try {
        let newUserId;
        let newUser;
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
            && req.body.active)) {return res.status(400).json({error: "Check request params"})};
        //Validate inputs
        let validateCsr = validate.isLength(username_csr, {min:3, max: 3});
        let validatePassword = validate.isLength(password, {min:3, max: 20});
        let validateFirstName = validate.isLength(first_name, {min:2, max: 40});
        let validateLastName = validate.isLength(last_name, {min:2, max: 40});
        let validatePhoneNum = validate.isMobilePhone(phone_num + '', "pl-PL");
        // let validateSubdivision = validate.isNumeric(subdivision_id +'');
        let validateRoleId = validate.isNumeric(role_id + '', {min: 1, max: 128});
        let validateActive = validate.isNumeric(active + '', {min: 0, max: 1});

        //Array constains invalid inputs names
        let invalidInputs = [];

        if (!validateCsr) invalidInputs.push("username_csr");
        if (!validatePassword) invalidInputs.push("password");
        if (!validateFirstName) invalidInputs.push("first_name");
        if (!validateLastName) invalidInputs.push("last_name");
        if (!validatePhoneNum) invalidInputs.push("phone_num");
        // if (!validateSubdivision) invalidInputs.push("subdivision_id");
        if (!validateRoleId) invalidInputs.push("role_id");
        if (!validateActive) invalidInputs.push("active");

        //If any invalid inputs, return 400
        if (invalidInputs.length>0) return res.status(400).json({invalidInputs: invalidInputs});

        //Hash password
        const hash = await bcrypt.hash(password, saltRounds);
        //Insert values to users table
        let insertUser = await trx("users")
        .insert({ username_csr, first_name, last_name, phone_num, active, hash, role_id })
        //Then get new user ID
        console.log(trx.isCompleted());
        if (insertUser === 0) {
            trx.rollback();
            return res.status(500).json({error: "Insert error"});
        } else {
            newUser = await trx("users").first("user_id").where({ username_csr: username_csr });
            console.log(trx.isCompleted());
        };
        //Then insert subdivisions to users_subdivision join table
        if (newUser){
            newUserId = newUser.user_id;
            // console.log(newUser);
            // console.log(newUserId);
            //Check if there is more than one subdivision value
            //TODO remove this if after changing to array input
            if (subdivision_id.length > 1) { 
                //TODO change to expect array input!!************************************
                //Convert string into array
                let subdivisionsIdsArray = subdivision_id.split(",");
                let insertQueryArray = [];
                let usersSubdivisions;
                //Make query obcjects based on array
                subdivisionsIdsArray.forEach(element => {
                    usersSubdivisions = {};
                    usersSubdivisions.users_user_id = newUser.user_id;
                    usersSubdivisions.subdivisions_subdivision_id = element;
                    insertQueryArray.push(usersSubdivisions);
                });
                //Finally insert
                await trx("users_subdivisions").insert(insertQueryArray);
                trx.commit();
                console.log(trx.isCompleted());
                return res.status(201).json({ message: "User created", newUserId: newUserId});
                
            } else { 
                //Or if just one subdivision just insert values
                let insertQuery = { users_user_id: newUser.user_id, subdivisions_subdivision_id: subdivision_id };
                await trx("users_subdivisions").insert(insertQuery);
                trx.commit();
                console.log(trx.isCompleted());
                return res.status(201).json({ message: "User created", newUserId: newUserId });
            };
        } else {
            trx.rollback();
            return res.status(500).json({error: "DB error, user inserted but id not found. Rolled back"});
        };
    } catch (error) {
        trx.rollback();
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
        // let validateSubdivision = validate.isNumeric(subdivision_id + '');
        let validateRoleId = validate.isNumeric(role_id + '', { min: 1, max: 128 });
        let validateActive = validate.isNumeric(active + '', { min: 0, max: 1 });

        //Array constains invalid inputs names
        let invalidInputs = [];

        if (!validateCsr) invalidInputs.push("username_csr");
        if (!validateFirstName) invalidInputs.push("first_name");
        if (!validateLastName) invalidInputs.push("last_name");
        if (!validatePhoneNum) invalidInputs.push("phone_num");
        // if (!validateSubdivision) invalidInputs.push("subdivision_id");
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
        

        //Start transaction
        const trx = await knex.transaction();
        //Send update query to DB and assign true/false update response from DB to variable
        let updatedUser = await trx("users")
        .where({ user_id:id })
        .update(user)
        .catch((err)=>{
            trx.rollback();
            throw Error(err);
        });
        console.log("***UpdatedUser: "+ updatedUser);
        //Seperate query to assosiation table
        // if (updatedUser !== 1) return res.status(500).json({ error: "User update error, rolled back" });
        let deletedSubdivisions = await trx("users_subdivisions")
        .where({ users_user_id: id })
        .delete()
        .catch((err) => {
            trx.rollback();
            throw Error(err);
        });
        console.log("***deleted subs:" +deletedSubdivisions);
        //Check if user has been assigned with more than one subdivision
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
        //Insert  divisions
        await trx("users_subdivisions")
        .insert(insertQueryArray)
        .then(()=>{
            trx.commit();
            return res.status(201).json({ message: "User updated", updatedUserId: id });
        })
        .catch((err) => {
            trx.rollback();
            throw Error(err);
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
