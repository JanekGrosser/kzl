var express = require("express");
const router = express.Router();

const authController = require("../lib/auth");

router.post("/login", authController.login);

module.exports = router;