let express = require("express");
let Router = express.Router();
let userDB = require("../DB/userSchema");
let Joi = require("@hapi/joi");
let bcrypt = require("bcrypt");

//Routes

//Login
Router.post("/Login", async (req, res) => {
  // Validation
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  // check if user exists
  let emailCheck = await userDB.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (!emailCheck) {
    return res.status(403).send({ message: "User Doesn't Exist" });
  }
  // check password
  let passwordCheck = await bcrypt.compare(
    req.body.userLogin.userPassword,
    emailCheck.userLogin.userPassword
  );
  if (!passwordCheck) {
    return res.status(403).send({ message: "Invalid Password" });
  }
  let token = emailCheck.GenerateToken();
  // send response
  res.header("x-auth-token", token).send({
    message: "Login successful!",
    token: token,
    isAdmin: emailCheck.isAdmin
  });
});

// Validation
function ValidationError(error) {
  let Schema = Joi.object({
    userLogin: {
      userEmail: Joi.string()
        .required()
        .email(),
      userPassword: Joi.string().required()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
