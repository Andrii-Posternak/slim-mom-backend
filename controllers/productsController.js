const moment = require("moment");
const EatenProduct = require("../models/eatenProduct");
const Product = require("../models/product");
const User = require("../models/user");
const { RequestError, calcDailyCalorieNorm } = require("../helpers");
const { eatenProductSchema } = require("../schemas/products");
const { userDataSchema } = require("../schemas/users");

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getProductFromDB = async (req, res, next) => {
  try {
    const { productName } = req.query;
    const regexProductName = escapeRegex(productName);
    if (!productName) {
      throw RequestError(400, "Invalid query data");
    }
    const result = await Product.find({
      $or: [
        { "title.ua": { $regex: regexProductName, $options: "i" } },
        { "title.en": { $regex: regexProductName, $options: "i" } },
      ],
    }).select("-categories.ru -title.ru -__v");
    if (result.length === 0) {
      throw RequestError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getDailyCalPublic = async (req, res, next) => {
  try {
    const { error } = userDataSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const userInfo = req.body;
    const dailyCalorieNorm = calcDailyCalorieNorm(userInfo);
    const products = await Product.find({
      [`groupBloodNotAllowed.${userInfo.bloodType}`]: true,
    });
    const prohibitedPoducts = products.map(({ title }) => ({
      ua: title.ua,
      en: title.en,
    }));
    res.json({ dailyRate: dailyCalorieNorm, notRecFood: prohibitedPoducts });
  } catch (error) {
    next(error);
  }
};

const getDailyCalPrivate = async (req, res, next) => {
  try {
    const { error } = userDataSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const userInfo = req.body;
    const dailyCalorieNorm = calcDailyCalorieNorm(userInfo);
    const products = await Product.find({
      [`groupBloodNotAllowed.${userInfo.bloodType}`]: true,
    });
    const prohibitedPoducts = products.map(({ title }) => ({
      ua: title.ua,
      en: title.en,
    }));
    const { id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...userInfo,
        dailyRate: dailyCalorieNorm,
        notRecFood: prohibitedPoducts,
      },
      { new: true }
    ).select("-name -email -password -createdAt -updatedAt -token");
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!date) {
      throw RequestError(400, "Invalid query data");
    }
    const { id: owner } = req.user;
    const products = await EatenProduct.find({ owner });
    if (products.length === 0) {
      throw RequestError(404, "Not found");
    }
    const result = products
      .filter((prod) => moment(prod.date).format("DD.MM.YYYY") === date)
      .sort((a, b) => b.date - a.date);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { error } = eatenProductSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { productName, weight } = req.body;
    const product = await Product.find({
      $or: [{ "title.ua": productName }, { "title.en": productName }],
    });
    if (product.length === 0) {
      throw RequestError(500, "There is no such product in the database");
    }
    const [{ calories }] = product;
    const countedCalories = Math.round((calories / 100) * weight);
    const { id: owner } = req.user;
    const result = await EatenProduct.create({
      ...req.body,
      calories: countedCalories,
      owner,
      date: new Date(),
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw RequestError(400, "Invalid query data");
    }
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
