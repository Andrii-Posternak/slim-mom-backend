const Joi = require("joi");

const eatenProductSchema = Joi.object({
  productName: Joi.string().required(),
  weight: Joi.number().positive().required(),
  date: Joi.date().required(),
});

module.exports = { eatenProductSchema };
