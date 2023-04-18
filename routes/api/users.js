const express = require("express");
const usersController = require("../../controllers/usersController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.get("/current", auth, usersController.getCurrentUser);

module.exports = router;
