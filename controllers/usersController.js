const User = require("../models/user");
const { RequestError } = require("../helpers");
require("dotenv").config();

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const existingUser = await User.findById(_id, {
      password: 0,
      updatedAt: 0,
      token: 0,
    });
    if (!existingUser) {
      throw RequestError(401, "Not authorized");
    }
    res.json(existingUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
};
