function isAdmin(req, res, next) {
  if (req.userSchema.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "Your are not Admin!" });
  }
}

module.exports = isAdmin;
