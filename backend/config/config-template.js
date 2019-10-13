"use-strict";
// 
// Template for config.js.
// Use this template to indicate changes in config file, but provide only non-sensitive values ex.: password: "mypassword".
// Uncomment the last line in real config.js file.
// *
// Change env value depending on enviroment ("dev", "test", "prod").
const env = "dev";

// Local development.
const dev = {
    db: {
        client: 'mysql2',
        host: "127.0.0.1",
        user: "user",
        password: "password",
        database: "KZLv3"
    }
}

// Test server.
const test = {
    db: {
        client: 'mysql2',
        host: "127.0.0.1",
        user: "user",
        password: "password",
        database: "KZLv3"
    }
}

// Production server.
const prod = {
    db: {
        client: 'mysql2',
        host: "127.0.0.1",
        user: "user",
        password: "password",
        database: "KZLv3"
    }
}

const config = { dev, test, prod };

// Uncomment the line below in real config.js file.
// module.exports = config[env];
