"use-strict";
//TODO add missing try catch blocks
//TODO consider always using username_csr instead od user_id in requests

const jwt = require("jsonwebtoken");

const config = require("../config/config");
const knex = require("../config/knex");

/**
 * Middleware function checks if token from request authirization header is valid.
 * On success it passes decoded token payload to next middleware.
 * On failure it returns 401 response.
 */
exports.checkJwt = async (req, res, next) => {
    try {
        const baerer = req.headers.authorization;
        //Remove "Baerer " part from authorization header
        let token = baerer.slice(8, -1);
        //Verify if token is ok
        res.locals.payload = jwt.verify(token, config.jwtSecret);
    } catch (err) {
        return res.status(401).json(err.message);
    };
    //Set verified token payload to res.locals and pass to next middleware
    if (res.locals.payload) {
        return next();
    };
};

/**
 * Middleware function checks if user has certain role.
 * @param roles {array} - Role names
 */
exports.hasRole = (roles) => {
    //Return function syntax is required for middleware to accept custom parameters
    return async (req, res, next) => {
        //Get user id from previous middleware
        const id = res.locals.payload.id;
        //Get user data from DB
        const user = await knex("user")
            .where({ user_id: id })
            .first("user_id", "fp_name", "role", "active")
            .innerJoin("fp", "user.fp_id", "fp.fp_id")
            .innerJoin("roles", "user.role_id", "roles.role_id");
        //if role from token payload matches the user's role pulled from DB then authorize access
        if (roles.includes(user.role)) {
            return next();
        //else just send status to limit response details for unauthorized request
        } else {
            return res.sendStatus(401).end();
        };
    };
};

/**
 * Middleware function checks if user has certain role OR requesting user requests own details
 * @param roles {array} - Role names
 */
exports.hasRoleOrIdMatch = (roles) => {
    //Return function syntax is required for middleware to accept custom parameters
    return async (req, res, next) => {
        //Get user id from previous middleware
        const id = res.locals.payload.id;
        const requestedId = parseInt(req.params.user_id);
        //If user requests his own details, authorize
        if (id === requestedId){
            return next();
        //Or check if has requred role
        } else {
            //Get user data from DB
            const user = await knex("user")
                .where({ user_id: id })
                .first("user_id", "fp_name", "role", "active")
                .innerJoin("fp", "user.fp_id", "fp.fp_id")
                .innerJoin("roles", "user.role_id", "roles.role_id");
            //If role from token payload matches the user's role pulled from DB then authorize access
            if (roles.includes(user.role)) {
                return next();
                //else just send status to limit response details for unauthorized request
            } else {
                return res.sendStatus(401).end();
            };
        };
    };
};
