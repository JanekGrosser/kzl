var express = require("express");
const router = express.Router();

const dataController = require("../lib/data");

const middleware = require("../middleware/middleware");


router.get("/current-calendar/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), dataController.getCurrentShifts);
router.get("/users-calendars/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz"]), dataController.getUsersCalendars);
router.get("/day-calendar/:subdivision_id", middleware.checkJwt, middleware.hasRole(["adm", "koo", "koz"]), dataController.getDaySummary);


router.post("/users-calendars/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm"]), dataController.saveUsersCalendars);
router.post("/users-calendars/approval-phase/:user_id", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), dataController.saveApprovalCalendars);
router.post("/day-calendar", middleware.checkJwt, middleware.hasRole(["adm", "koz"]), dataController.saveSummaryCalendars);


//Dictionary tables routes TODO move to separate file
router.get("/subdivisions", middleware.checkJwt, dataController.getSubdivisionsDictionary);
router.get("/shifts", middleware.checkJwt, dataController.getShiftsDictionary);
router.get("/roles", middleware.checkJwt, dataController.getRolesDictionary);
router.get("/status", middleware.checkJwt, dataController.getStatusDictionary);
router.get("/months", middleware.checkJwt, dataController.getMonthsDictionary);
router.get("/current-month", middleware.checkJwt, dataController.getCurrentMonth);
router.get("/following-months", middleware.checkJwt, dataController.getFollowingMonths);



module.exports = router;
