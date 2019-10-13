"use: strict";

const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.route");
const morgan = require("morgan");

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());


app.use("/api/users", userRoute);

app.listen(4009, ()=>{console.log("Server running @ 4009")});

