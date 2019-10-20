"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator
//TODO refactor to ensure not blocking the Event Loop


const knex = require("../config/knex");

exports.getCurrentShifts = async (req, res) => {
    try {
        let id = req.params.user_id;
        //Get current year and month
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        //Concatenate year and month and add wildcard % symbol for day
        let dateQueryString = currentYear + "-" + currentMonth + "%";
        //Get requested shifts form db
        let shifts = await knex("man_shifts")
            .select("date", "shift_id", "status_id")
            .where({ user_id: id })
            .andWhere("date", "like", dateQueryString)
            .orderBy([{ column: "date" }, { column: "shift_id" }]);
        //Send shifts as response
        return res.status(200).json(shifts);   
    } catch (err){
        return res.status(500).send(err)
    };
};

exports.getSubdivisionsDictionary = async (req, res) => {
    try{
        const subdivisions = await knex("subdivisions").select();
        return res.status(200).json(subdivisions);

    }catch(error){
        res.sendStatus(500).end();
    };
};

exports.getRolesDictionary = async (req, res) => {
    try{
        const roles = await knex("roles").select();
        return res.status(200).json(roles);

    }catch(error){
        res.sendStatus(500).end();
    };
};

exports.getShiftsDictionary = async (req, res) => {
    try{
        const shifts = await knex("shifts").select();
        return res.status(200).json(shifts);

    }catch(error){
        res.sendStatus(500).end();
    };
};

exports.getStatusDictionary = async (req, res) => {
    try {
        const status = await knex("status").select();
        return res.status(200).json(status);

    } catch (error) {
        res.sendStatus(500).end();
    };
};
