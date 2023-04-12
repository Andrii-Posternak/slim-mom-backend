const express = require("express");
const caloriesController = require("../../controllers/caloriesController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.post("/auth", auth, caloriesController.getDailyCalPrivate);

router.post("/", caloriesController.getDailyCalPublic);

module.exports = router;
