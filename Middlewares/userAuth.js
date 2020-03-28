let jwt = require("jsonwebtoken");
let config = require("config");

function verifyToken(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) {
    return res.status(403).send({ message: " token not found " });
  }
  let dcode = jwt.verify(token, config.get("SecretKey"));
  req.userSchema = dcode;
  next();
}

module.exports = verifyToken;
