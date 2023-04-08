const { Schema, model } = require("mongoose");

const eatenProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "productName is required"],
    },
    weight: {
      type: Number,
      required: [true, "weight is required"],
    },
    calories: {
      type: Number,
    },
    date: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

const EatenProduct = model("eatenProduct", eatenProductSchema);

module.exports = EatenProduct;
