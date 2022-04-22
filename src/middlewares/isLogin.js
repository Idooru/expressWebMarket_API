const jwt = require("jsonwebtoken");
const Auth = require("../models/auths");

module.exports = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const userId = req.decoded.userId;
    const result = await Auth.findOne({
      where: { id: userId },
      attributes: ["userType"],
    });

    return result.userType === "master"
      ? ((req.isMaster = true), next())
      : next();
  } catch (err) {
    return err.name === "TokenExpiredError"
      ? res.status(419).json({
          code: 419,
          message: "The token has expired",
        })
      : res.status(401).json({
          code: 401,
          message: "The token is invalid",
        });
  }
};
