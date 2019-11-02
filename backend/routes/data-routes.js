var express = require("express");
const router = express.Router();

const dataController = require("../lib/data");
const dictionariesController = require("../lib/dictionary");

const middleware = require("../middleware/middleware");


router.get("/current-calendar/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), dataController.getCurrentShifts);
router.get("/users-calendars/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), dataController.getUsersCalendars);
router.get("/day-calendar/:subdivision_id", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), dataController.getDaySummary);


router.post("/users-calendars/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm"]), dataController.saveUsersCalendars);
router.post("/users-calendars/approval-phase/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), dataController.saveApprovalCalendars);
router.post("/day-calendar", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), dataController.saveSummaryCalendars);


//Dictionary tables routes
router.get("/subdivisions", middleware.checkJwt, dictionariesController.getSubdivisionsDictionary);
router.get("/shifts", middleware.checkJwt, dictionariesController.getShiftsDictionary);
router.get("/roles", middleware.checkJwt, dictionariesController.getRolesDictionary);
router.get("/status", middleware.checkJwt, dictionariesController.getStatusDictionary);
router.get("/months", middleware.checkJwt, dictionariesController.getMonthsDictionary);
router.get("/current-month", middleware.checkJwt, dictionariesController.getCurrentMonth);
router.get("/following-months", middleware.checkJwt, dictionariesController.getFollowingMonths);
router.get("/months-phase", middleware.checkJwt, dictionariesController.getMonthsPhase);


module.exports = router;
