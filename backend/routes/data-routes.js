var express = require("express");
const router = express.Router();

const dataController = require("../lib/data");

const middleware = require("../middleware/middleware");

router.get("/current-callendar/:user_id", middleware.checkJwt, middleware.hasRoleOrIdMatch(["adm", "koo", "koz", "pre"]), dataController.getCurrentShifts);

module.exports = router;
