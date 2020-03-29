let express = require("express");
let Router = express.Router();
let userDB = require("../DB/userSchema");
let bcrypt = require("bcrypt");
let mailer = require("nodemailer");
let Joi = require("@hapi/joi");

// Routes

Router.post("/resetPassword/:id", async (req, res) => {
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  let checkToken = await userDB.findOne({
    resetPasswordToken: req.params.id,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!checkToken) {
    return res.status(404).send({ message: " Token not found" });
  }
  console.log(checkToken);
  let checkPassword = await bcrypt.compare(
    req.body.userLogin.userPassword,
    checkToken.userLogin.userPassword
  );
  if (checkPassword) {
    return res
      .status(403)
      .send({ message: "New password can't be old password" });
  }
  let salt = await bcrypt.genSalt(10);
  checkToken.userLogin.userPassword = await bcrypt.hash(
    req.body.userLogin.userPassword,
    salt
  );
  checkToken.userResetPasswordToken = undefined;
  checkToken.userResetPasswordExpires = undefined;
  let result = checkToken.save();
  res.send({ message: "Password Changed successfully!", data: result });
});

function ValidationError(error) {
  let Schema = Joi.object({
    userLogin: {
      userPassword: Joi.string().required()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
