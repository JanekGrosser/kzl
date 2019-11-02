
"use-strict";
const knex = require("../config/knex");
const general = require("./general");
//####DICTIONARY TABLES API####
//TODO move to separate file

exports.getSubdivisionsDictionary = async (req, res) => {
    try {
        const subdivisions = await knex("subdivisions").select();
        return res.status(200).json(subdivisions);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getRolesDictionary = async (req, res) => {
    try {
        const roles = await knex("roles").select();
        return res.status(200).json(roles);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getShiftsDictionary = async (req, res) => {
    try {
        const shifts = await knex("shifts").select();
        return res.status(200).json(shifts);

    } catch (error) {
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
        let dateQueryString = general.currentYearMonth();
        const months = await knex("months").first().where({ year_month: dateQueryString });
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

exports.getFollowingMonths = async (req, res) => {
    try {
        let dateQueryString = general.currentYearMonth();
        const months = await knex("months").select().where("year_month", ">", dateQueryString).limit(5).orderBy("month_id");
        return res.status(200).json(months);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};
