"use-strict";

var express = require("express");
const router = express.Router();

const authController = require("../lib/auth");
const middleware = require("../middleware/middleware");

router.post("/login", authController.login);
router.post("/resetpassword/:username_csr", authController.resetPassword);
router.post("/newpassword/:user_id", middleware.checkJwt, authController.newPassword);

//middleware test routes 
//TODO: remove at some point
router.get("/secret/headers", middleware.checkJwt,(req, res)=>{res.json(req.headers)});
router.get("/headers",(req, res)=>{res.json(req.headers)});
router.get("/secret/payload", middleware.checkJwt,(req, res)=>{res.json(res.locals.payload)});

module.exports = router;