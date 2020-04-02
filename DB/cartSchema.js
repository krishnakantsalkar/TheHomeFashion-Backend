let mongoose = require("mongoose");

let cartSchemaData = new mongoose.Schema({
  productID: { type: String },
  quantity: { type: Number },
  totalPrice: { type: Number },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

let cartSchema = mongoose.model("Cart", cartSchemaData);

module.exports = Router;
