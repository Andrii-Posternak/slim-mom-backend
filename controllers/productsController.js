const EatenProduct = require("../models/eatenProduct");
const Product = require("../models/product");
const User = require("../models/user");
const { RequestError, calcDailyCalorieNorm } = require("../helpers");
const { eatenProductSchema } = require("../schemas/products");
const { userDataSchema } = require("../schemas/users");

const getProductFromDB = async (req, res, next) => {
  try {
    const { productName } = req.query;
    if (!productName) {
      throw RequestError(400, "Invalid query data");
    }
    const result = await Product.find({
      $or: [
        { "title.ua": { $regex: productName, $options: "i" } },
        { "title.en": { $regex: productName, $options: "i" } },
      ],
    }).select("-categories.ru -title.ru");
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
    const products = await EatenProduct.find({ owner }).populate(
      "owner",
      "name email dailyRate notRecFood"
    );
    const result = products
      .filter((prod) => prod.date.toDateString() === date)
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
      throw RequestError(400, "Missing required name field");
    }
    const { productName, weight } = req.body;
    const product = await Product.find({
      $or: [
        { "title.ru": productName },
        { "title.ua": productName },
        { "title.en": productName },
      ],
    });
    if (product.length === 0) {
      throw RequestError(404, "Not found");
    }
    const [{ calories }] = product;
    const countedCalories = (calories / 100) * weight;
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
