let mongoose = require("mongoose");

let productsSChemaData = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, max: 20 },
  description: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  offerPrice: { type: Number },
  isAvailable: { type: Boolean },
  isTodayOffer: { type: Boolean },
  category: { type: String },
  isAdmin: { type: Boolean },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

let productsSchema = mongoose.model("products", productsSChemaData);

module.exports = productsSchema;
