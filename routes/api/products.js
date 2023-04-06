const express = require("express");
const productsController = require("../../controllers/productsController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.get("/", auth, productsController.getProducts);

router.post("/", auth, productsController.addProduct);

router.delete("/:productId", auth, productsController.removeProduct);

router.get("/database", auth, productsController.getProductFromDB);

router.get("/publicCalorie", productsController.getDailyCalPublic);

router.get("/privateCalorie", auth, productsController.getDailyCalPrivate);

module.exports = router;
