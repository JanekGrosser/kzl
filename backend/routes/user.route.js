var express = require("express");
const router = express.Router();

const userController = require("../lib/user");

router.get("/", userController.listAll);

router.post("/new", userController.newUser);

module.exports = router;