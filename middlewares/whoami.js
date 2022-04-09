module.exports = (req, res, next) => {
  if (req.isMaster) {
    req.authority = "master";
    return next();
  }
  req.authority = "user";
  return next();
};
