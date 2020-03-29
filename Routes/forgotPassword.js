let express = require("express");
let Router = express.Router();
let userDB = require("../DB/userSchema");
let Joi = require("@hapi/joi");
let crypto = require("crypto");
let mailer = require("nodemailer");
// Routes

Router.post("/forgotPassword", async (req, res) => {
  let token = crypto.randomBytes(32).toString("hex");
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  let checkEmail = await userDB.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (!checkEmail) {
    return res.status(404).send({ message: "Invalid Email id" });
  }
  checkEmail.resetPasswordToken = token;
  checkEmail.resetPasswordExpires = Date.now() + 3600000;
  let result = await checkEmail.save();
  console.log(result);
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
    to: checkEmail.userLogin.userEmail, // list of receivers
    subject: "Password change request!", // Subject line:smile:
    text: `Your password recovery link is:  http://localhost:4500/ResetPassword/${token}` // plain text body
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
  res.header("x-auth-token", token).send({
    message: "Registration Successful, Mail sent!",
    data: result,
    token: token
  });
});

//Validation

function ValidationError(error) {
  let Schema = Joi.object({
    userLogin: {
      userEmail: Joi.string()
        .required()
        .email()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
