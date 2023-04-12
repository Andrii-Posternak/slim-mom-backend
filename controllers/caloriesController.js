const Product = require("../models/product");
const User = require("../models/user");
const { RequestError, calcDailyCalorieNorm } = require("../helpers");
const { userDataSchema } = require("../schemas/users");

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

module.exports = {
  getDailyCalPublic,
  getDailyCalPrivate,
};
