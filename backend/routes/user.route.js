"use-strict";

var express = require("express");
const router = express.Router();

const userController = require("../lib/user");

router.get("/", userController.listAll);
router.post("/new", userController.newUser);
router.get("/:user_id", userController.getUser);
router.delete("/:user_id", userController.deleteUser);


module.exports = router;
