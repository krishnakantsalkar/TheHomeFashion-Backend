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
    to: checkToken.userLogin.userEmail, // list of receivers
    subject: "Password Change request", // Subject line:smile:
    text: `Your password was changed succesfully!` // plain text body
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
