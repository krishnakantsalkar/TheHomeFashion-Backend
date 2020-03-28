let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let config = require("config");

let userSchemaData = new mongoose.Schema({
  firstname: { type: String, required: true, min: 2, max: 20 },
  lastname: { type: String, required: true, min: 2, max: 20 },
  age: { type: Number, min: 13 },
  gender: { type: Boolean },

  userLogin: {
    userEmail: { type: String },
    userPassword: { type: String }
  },
  isAdmin: { type: Boolean },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  newLetterCheck: { type: Boolean },
  termsAcceptCheck: { type: Boolean },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

userSchemaData.methods.GenerateToken = function() {
  let token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    },
    config.get("SecretKey")
  );
  return token;
};

let userSchema = mongoose.model("New userSchema", userSchemaData);

module.exports = userSchema;
