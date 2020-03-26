let mongoose = require("mongoose");

let contactUsSchemaData = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});

let contactUsSchema = mongoose.model("Contact Us", contactUsSchemaData);

module.exports = contactUsSchema;
