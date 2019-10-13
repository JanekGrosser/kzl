"use-strict";

var express = require("express");
const router = express.Router();

const authController = require("../lib/auth");

router.post("/login", authController.login);
router.patch("/reset/:username_csr", authController.resetPassword);

module.exports = router;