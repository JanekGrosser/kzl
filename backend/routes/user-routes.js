"use-strict";

var express = require("express");
const router = express.Router();

const userController = require("../lib/user");

const middleware = require("../middleware/middleware");

//Roles:
//adm = Admin
//ser = Serwisant
//ins = Instalator
//koo = Koordynator
//koz = Koordynator zarządczy

router.get("/", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), userController.listAll);
router.get("/subdivision-users/:subdivision_id", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), middleware.hasSubdivisionAccess, userController.listAllSubdivision);
router.get("/list/:subdivision_id", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), middleware.hasSubdivisionAccess, userController.usersQueriedList);
router.post("/new", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.newUser);
router.get("/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), userController.getUser);
router.post("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz", "koo"]), userController.editUser);
router.delete("/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.deleteUser);

router.get("/approval-time/list", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), userController.getUserApprovalTimestamp);


module.exports = router;
