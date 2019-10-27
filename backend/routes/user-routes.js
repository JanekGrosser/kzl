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

router.get("/", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), userController.listAll);
router.post("/new", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.newUser);
router.get("/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), userController.getUser);
router.post("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.editUser);
router.delete("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.deleteUser);

router.get("/approval-timestamps/:month_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.getUserApprovalTimestamp);


module.exports = router;
