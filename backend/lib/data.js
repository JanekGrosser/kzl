"use-strict";

//TODO check to ensure not blocking the Event Loop


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
            .select("shift_id", "month_id", "day_num", "status_id")
            .where({ user_id: id })
            .andWhere("date", "like", dateQueryString)
            .orderBy([{ column: "date" }, { column: "shift_id" }]);
        //Send shifts as response
        return res.status(200).json(shifts);   
    } catch (error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getSubdivisionsDictionary = async (req, res) => {
    try{
        const subdivisions = await knex("subdivisions").select();
        return res.status(200).json(subdivisions);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getRolesDictionary = async (req, res) => {
    try{
        const roles = await knex("roles").select();
        return res.status(200).json(roles);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getShiftsDictionary = async (req, res) => {
    try{
        const shifts = await knex("shifts").select();
        return res.status(200).json(shifts);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getStatusDictionary = async (req, res) => {
    try {
        const status = await knex("status").select();
        return res.status(200).json(status);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getMonthsDictionary = async (req, res) => {
    try {
        const months = await knex("months").select();
        return res.status(200).json(months);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getCurrentMonth = async (req, res) => {
    try {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        //Concatenate year and month and add wildcard % symbol for day
        let dateQueryString = currentYear + "-" + currentMonth + "%";
        const months = await knex("months").first().where("year_month", "like", dateQueryString);
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};