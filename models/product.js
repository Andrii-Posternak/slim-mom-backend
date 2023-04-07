const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  categories: {
    type: Object,
    required: [true, "categories is required"],
  },
  weight: {
    type: Number,
    required: [true, "weight is required"],
  },
  title: {
    type: Object,
    required: [true, "title is required"],
  },
  calories: {
    type: Number,
    required: [true, "calories is required"],
  },
  groupBloodNotAllowed: {
    type: Array,
    required: [true, "groupBloodNotAllowed is required"],
  },
});

const Product = model("product", productSchema);

module.exports = Product;
