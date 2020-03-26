let mongoose = require("mongoose");

let userSchemaData = new mongoose.Schema({
  firstname: { type: String, required: true, min: 2, max: 20 },
  lastname: { type: String, required: true, min: 2, max: 20 },
  age: { type: Number, min: 13 },
  gender: { type: Boolean },

  userLogin: {
    userEmail: { type: String },
    userPassword: { type: String }
  },
  newLetterCheck: { type: Boolean },
  termsAcceptCheck: { type: Boolean }
});

let userSchema = mongoose.model("New userSchema", userSchemaData);

module.exports = userSchema;
