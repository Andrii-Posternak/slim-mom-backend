const User = require("../models/user");
const {
  RequestError,
  // sendEmail
} = require("../helpers");
require("dotenv").config();

// const { SENDGRID_HOST } = process.env;

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

// const verification = async (req, res, next) => {
//   try {
//     const { verificationToken } = req.params;
//     const existingUser = await User.findOne({ verificationToken });
//     if (!existingUser) {
//       throw RequestError(404, "User not found");
//     }
//     await User.findByIdAndUpdate(existingUser._id, {
//       verificationToken: null,
//       verify: true,
//     });
//     res.json({
//       message: "Verification successful",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const reVerification = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       throw RequestError(400, "Missing required field email");
//     }
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       throw RequestError(404, "User not found");
//     }
//     if (existingUser.verify) {
//       throw RequestError(400, "Verification has already been passed");
//     }
//     const msg = {
//       to: email,
//       subject: "Verify your email",
//       html: `<p>This email has been resent because your account was not verified. Follow the <a href="${SENDGRID_HOST}/api/users/verify/${existingUser.verificationToken}" target="_blank">link</a> to verify your email</p>`,
//     };
//     await sendEmail(msg);
//     res.json({
//       message: "Verification email sent",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getCurrentUser,
  // verification,
  // reVerification,
};
