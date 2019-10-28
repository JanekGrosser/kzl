"use:strict";

const config = require("./config.js");
const knex = require('knex')(
    {
        client: config.db.client,
        connection: {
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            port: config.db.port
        },
        pool:{min:2, max: 10},
        // debug: true,
        // asyncStackTraces: true
    }
);
module.exports = knex;
