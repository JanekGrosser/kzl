"use:strict";

const config = require("./config.js");
const knex = require('knex')(
    {
        client: config.db.client,
        connection: {
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        },
        debug: true,
        asyncStackTraces: true
    }
);
module.exports = knex;
