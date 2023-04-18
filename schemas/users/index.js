const Joi = require("joi");

const userDataSchema = Joi.object({
  height: Joi.number().min(50).max(250).integer().required(),
  age: Joi.number().min(1).max(100).integer().required(),
  currentWeight: Joi.number().min(5).max(250).required(),
  desiredWeight: Joi.number().min(5).max(250).required(),
  bloodType: Joi.number().valid(1, 2, 3, 4).required(),
});

module.exports = {
  userDataSchema,
};
