"use-strict";

const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const config = require("../config/config");
// const knex = require("../config/knex");
// const saltRounds = 10;

exports.checkJwt = (req, res, next) => {
    const baerer = req.headers["authorization"];
    let token = baerer.slice(8, -1)
    let err;
    try {
        req.payload = jwt.verify(token, config.jwtSecret);
    } catch (error) {
        err = error;
    };
    if (req.payload) {
        next();
    } else {
        res.status(401).send(err.message);
    };
};