const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const {
  RequestError,
  // sendEmail
} = require("../helpers");
const { registerSchema, loginSchema } = require("../schemas/auth");
require("dotenv").config();

const {
  // SENDGRID_HOST,
  TOKEN_KEY,
  TOKEN_LIFE_TIME,
} = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw RequestError(409, "Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // const verificationToken = uuidv4();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // verificationToken,
    });

    // const msg = {
    //   to: email,
    //   subject: "Verify your email",
    //   html: `<p>Follow the <a href="${SENDGRID_HOST}/api/users/verify/${verificationToken}" target="_blank">link</a> to verify your email</p>`,
    // };
    // await sendEmail(msg);

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw RequestError(401, "Email or password is wrong");
    }
    // if (!existingUser.verify) {
    //   throw RequestError(401, "Email is not verified");
    // }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw RequestError(401, "Email or password is wrong");
    }
    const payload = { id: existingUser._id };
    const token = jwt.sign(payload, TOKEN_KEY, { expiresIn: TOKEN_LIFE_TIME });
    await User.findByIdAndUpdate(existingUser._id, { token });
    res.json({
      token,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        dailyRate: existingUser.dailyRate,
        notRecFood: existingUser.notRecFood,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };
