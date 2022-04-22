const dataWorker = require("../data/authData");
const errorWorker = require("../errors/authControllerErr");
const passport = require("passport");

async function login(req, res, next) {
  try {
    passport.authenticate("local", (error, user, info) => {
      if (error || !user) {
        return res.status(401).json(info);
      }

      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          return next(loginError);
        }

        const token = dataWorker.createJwtToken(user);
        const result = {};

        result.user = user.dataValues;
        result.token = token;

        return res.status(200).json({
          code: 200,
          message: "Sucess to login and a token has been verifyed",
          result,
        });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function me(req, res) {
  const nickname = req.decoded.user.nickname;
  const authority = req.authority;
  const result =
    req.authority === "master"
      ? {
          code: 200,
          message: "The token is valid, welcome master",
          nickname,
          authority,
        }
      : {
          code: 200,
          message: "The token is valid",
          nickname,
          authority,
        };

  return res.status(200).json({ result });
}

module.exports = {
  login,
  me,
};
