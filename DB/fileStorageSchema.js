let mongoose = require("mongoose");

let fileUploadSchema = new mongoose.Schema({
  image: { type: String, required: true }
});

let fileStorage = mongoose.model("File Storage", fileUploadSchema);

module.exports = fileStorage;
