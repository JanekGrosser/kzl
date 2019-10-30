"use-strict";
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const knex = require("../config/knex");

/**
 * @async Middleware function checks if token from request authorization header is valid.
 * @returns On success it passes decoded token payload to next middleware.
 * @returns On failure it returns 401 response.
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @param {string} req.haeders.authorization
*/
exports.checkJwt = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        //Remove "Bearer " part from authorization header
        let token = bearer.slice(7);
        // console.log(token);
        //Verify if token is ok
        res.locals.payload = jwt.verify(token, config.jwtSecret);
        //Set verified token payload to res.locals and pass to next middleware
        if (res.locals.payload) {
            return next();
        };
    } catch (error) { //TODO seperate error response and bad token response
        return res.sendStatus(403);
    };
};

/**
 * @async Middleware function checks if user has certain role.
 * @returns On success just passes to next
 * @returns On failure returns 403 server response
 * @param {array} roles - Role names
 * @param {string} res.locals.payload.id
 * @param {*} req
 * @param {*} res
 * @param {*} next
*/
exports.hasRole = (roles) => {
    //Return function syntax is required for middleware to accept custom parameters
    return async (req, res, next) => {
        try {
            //Get user id from previous middleware
            let userId = res.locals.payload.id;
            //Get user data from DB
            const user = await knex("users_view")
                .where({ user_id: userId })
                .first("user_id", "user_subdivisions", "role", "active");
            //if role from token payload matches the user's role pulled from DB then authorize access
            if (roles.includes(user.role)) {
                return next();
                //else just send status to limit response details for unauthorized request
            } else {
                return res.sendStatus(403).end();
            };
        } catch(error) {
            console.log(error);
            return res.sendStatus(500);            
        };
    };
};

/**
 * @async Middleware function checks if user has certain role OR requesting user requests own details
 * @returns On success passes to next function/middleware
 * @returns On failure 403
 * @param {array} roles - Role names
 * @param {string} req.locals.payload.id
 * @param {string} req.params.user_id //TODO camelCase?
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.hasRoleOrIdMatch = (roles) => {
    //Return function syntax is required for middleware to accept custom parameters
    return async (req, res, next) => {
        try {
            //Get user id from previous middleware
            let userId = res.locals.payload.id;
            const requestedId = parseInt(req.params.user_id);
            //If user requests his own details, authorize
            if (userId === requestedId) {
                return next();
                //Or check if has requred role
            } else {
                //Get user data from DB
                let user = await knex("users_view")
                    .where({ user_id: userId })
                    .first("user_id", "user_subdivisions", "role", "active")
                //If role from token payload matches the user's role pulled from DB then authorize access
                if (roles.includes(user.role)) {
                    return next();
                    //else just send status to limit response details for unauthorized request
                } else {
                    return res.sendStatus(403).end();
                };
            };
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        };
    };
};

/**
 * @async - Middleware comapares users subdivision with requested subdivision data parameter
 * @returns On success passes to next function/middleware
 * @returns On failure 403
 * @param {string} req.locals.payload.user_subdivisions //TODO Array
 * @param {string} res.locals.payload.role
 * @param {string} req.params.subdivision_id //TODO Array
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.hasSubdivisionAccess = async (req, res, next) => {
    try {
        // let userId = req.locals.payload.id;
        let userRole = res.locals.payload.role;
        if (userRole.includes("adm")) {
            return next();
        };
        let userSubdivisions = res.locals.payload.user_subdivisions;
        let requestedSubdivision = req.params.subdivision_id;
        console.log(`users:${userSubdivisions}`);
        console.log(`requested:${requestedSubdivision}`);
        if (userSubdivisions.includes(requestedSubdivision)) {
            return next();
        } else {
            return res.status(403).json("No acces to this subdivisions data");
        }
    } catch (error){
        console.log(error);
        res.sendStatus(500);
    }
};
