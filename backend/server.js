"use: strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(4009, ()=>{console.log("Server running @ 4009")});

