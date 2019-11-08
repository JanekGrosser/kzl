"use: strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const PORT = 4009;
const scheduled = require("./lib/cron");

const userRoutes = require("./routes/user-routes");
const authRoutes = require("./routes/auth-routes");
const dataRoutes = require("./routes/data-routes");

const app = express();

app.use(cors({credentials:true}));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}))

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

app.listen(PORT, () => { console.log(`Server running @ port ${PORT}`)});

scheduled.warningUnapprovedCalendars();
