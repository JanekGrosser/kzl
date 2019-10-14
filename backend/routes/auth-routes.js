"use-strict";

var express = require("express");
const router = express.Router();

const authController = require("../lib/auth");
const middleware = require("../middleware/middleware");

router.post("/login", authController.login);
router.post("/resetpassword/:username_csr", authController.resetPassword);
router.post("/newpassword/:user_id", authController.newPassword);
//middleware test route
router.get("/secret", middleware.checkJwt,(req, res)=>{res.send(req.payload)});
module.exports = router;