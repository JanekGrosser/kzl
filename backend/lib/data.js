"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests
//TODO add validator

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
