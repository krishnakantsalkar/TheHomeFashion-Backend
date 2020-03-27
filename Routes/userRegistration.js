let express = require("express");
let Router = express.Router();
let userDB = require("../DB/userSchema");
let Joi = require("@hapi/joi");
let bcrypt = require("bcrypt");
let mailer = require("nodemailer");

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
  let transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "supremegod.of.war.6@gmail.com", // generated ethereal user
      pass: "timepassZ1" // <--ADD password here (removed for github upload)
    }
  });

  if (!transporter)
    res.status(401).send({
      message: "something went wrong"
    });
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Mercer-Virus,The Home-Fashion:" <supremegod.of.war.6@gmail.com>', // sender address
    to: result.userLogin.userEmail, // list of receivers
    subject: "Thankyou For Registering!", // Subject line:smile:
    text: `Hey there New User!, Here's your Credentials:  ${result.userLogin.userEmail},${result.userLogin.userPassword} ` // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
  res.send({
    message: "Registration Successful, Mail sent!",
    data: result
  });
});

// get all users

Router.get("/allUsers", async (req, res) => {
  let allusers = await userDB.find();
  res.send(allusers);
});

// get all users by id

Router.get("/allUsers/:id", async (req, res) => {
  let usersById = await userDB.findById(req.params.id);
  res.send(usersById);
});

// update users by id

Router.put("/updateUsers/:id", async (req, res) => {
  let updateUsersById = await userDB.findByIdAndUpdate(req.params.id);
  if (!updateUsersById) {
    return res.status(404).send({ message: "User not found!" });
  }
  res.send(updateUsersById);
});

// Delete users by id

Router.delete("/deleteUsers/:id", async (req, res) => {
  let deleteUsersById = await userDB.findByIdAndDelete(req.params.id);
  if (!deleteUsersById) {
    return res.status(404).send({ message: "User not found!" });
  }
  res.send({ message: "User deleted" });
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
