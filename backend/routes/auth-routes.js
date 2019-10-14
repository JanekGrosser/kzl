"use-strict";

var express = require("express");
const router = express.Router();

const authController = require("../lib/auth");

router.post("/login", authController.login);
router.post("/resetpassword/:username_csr", authController.resetPassword);
router.post("/newpassword/:user_id", authController.newPassword);

module.exports = router;