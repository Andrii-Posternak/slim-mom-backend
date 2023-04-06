const EatenProduct = require("../models/eatenProduct");
const { RequestError } = require("../helpers");
const { eatenProductSchema } = require("../schemas/products");

const getProductFromDB = async (req, res, next) => {
  try {
    const { product } = req.query;
    if (!product) {
      throw RequestError(400, "Invalid query data");
    }

    // логіка пошуку в БД в колекції Product (п.7 ТЗ)

    res.json();
  } catch (error) {
    next(error);
  }
};

const getDailyCalPublic = async (req, res, next) => {
  try {
    // логіка підрахунку калорій та отримання
    // списку нерекомендованих продуктів (п.5 ТЗ)

    res.json();
  } catch (error) {
    next(error);
  }
};

const getDailyCalPrivate = async (req, res, next) => {
  try {
    // логіка підрахунку калорій та отримання
    // списку нерекомендованих продуктів (п.6 ТЗ)

    res.json();
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const products = await EatenProduct.find({ owner }).populate(
      "owner",
      "name email dailyRate notRecFood"
    );
    const result = products.sort((a, b) => b.date - a.date);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { error } = eatenProductSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing required name field");
    }
    const { id: owner } = req.user;
    const result = await EatenProduct.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id: owner } = req.user;
    const result = await EatenProduct.findOneAndRemove({
      $and: [{ _id: productId }, { owner }],
    });
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductFromDB,
  getDailyCalPublic,
  getDailyCalPrivate,
  getProducts,
  addProduct,
  removeProduct,
};
