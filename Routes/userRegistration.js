let express = require("express");
let Router = express.Router();
let userDB = require("../DB/userSchema");
let Joi = require("@hapi/joi");
let bcrypt = require("bcrypt");

//Routes

// Register Users
Router.post("/Registration", async (req, res) => {
  // Validation
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }

  //check if user exists
  let existingUser = await userDB.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (existingUser) {
    return res.status(403).send({ message: "User Already Registered!" });
  }

  //add data to DB
  let data = new userDB({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    userLogin: {
      userEmail: req.body.userLogin.userEmail,
      userPassword: req.body.userLogin.userPassword
    },
    newsLetterCheck: req.body.newsLetterCheck,
    termsAcceptCheck: req.body.termsAcceptCheck
  });

  //encrypt the password
  let salt = await bcrypt.genSalt(10);
  data.userLogin.userPassword = await bcrypt.hash(
    req.body.userLogin.userPassword,
    salt
  );
  let result = await data.save();
  return res.send({ message: "Registration Successfull", data: result });
});

// Validation
function ValidationError(error) {
  let Schema = Joi.object({
    firstname: Joi.string()
      .required()
      .min(2)
      .max(20),
    lastname: Joi.string()
      .required()
      .min(2)
      .max(20),
    age: Joi.number()
      .required()
      .min(13),
    gender: Joi.boolean().required(),
    userLogin: {
      userEmail: Joi.string()
        .required()
        .email(),
      userPassword: Joi.string().required()
    },
    newsLetterCheck: Joi.boolean(),
    termsAcceptCheck: Joi.boolean()
  });
  return Schema.validate(error);
}

module.exports = Router;
