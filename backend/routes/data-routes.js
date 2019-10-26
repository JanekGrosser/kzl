var express = require("express");
const router = express.Router();

const dataController = require("../lib/data");

const middleware = require("../middleware/middleware");

router.get("/current-calendar/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz", "pre"]), dataController.getCurrentShifts);
router.get("/subdivisions", middleware.checkJwt, dataController.getSubdivisionsDictionary);
router.get("/shifts", middleware.checkJwt, dataController.getShiftsDictionary);
router.get("/roles", middleware.checkJwt, dataController.getRolesDictionary);
router.get("/status", middleware.checkJwt, dataController.getStatusDictionary);
router.get("/months", middleware.checkJwt, dataController.getMonthsDictionary);
router.get("/current-month", middleware.checkJwt, dataController.getCurrentMonth);



module.exports = router;
