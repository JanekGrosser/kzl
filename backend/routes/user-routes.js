"use-strict";

var express = require("express");
const router = express.Router();

const userController = require("../lib/user");

const middleware = require("../middleware/middleware");

//Roles:
//adm = Admin
//tec = Technik
//koo = Koordynator
//koz = Koordynator zarządczy
//pre = Prezes

router.get("/", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz", "pre"]), userController.listAll);
router.post("/new", middleware.checkJwt, middleware.hasRole(["adm", "koz", "pre"]), userController.newUser);
router.get("/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz", "pre"]), userController.getUser);
router.post("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz", "pre"]), userController.editUser);
router.delete("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz", "pre"]), userController.deleteUser);


module.exports = router;
