const express = require("express");
const productsController = require("../../controllers/productsController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.get("/:date", auth, productsController.getProducts);

router.post("/", auth, productsController.addProduct);

router.delete("/:productId", auth, productsController.removeProduct);

router.get("/", auth, productsController.getProductFromDB);

router.post("/publicCalorie", productsController.getDailyCalPublic);

router.post("/privateCalorie", auth, productsController.getDailyCalPrivate);

module.exports = router;
