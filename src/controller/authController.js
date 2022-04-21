const dataWorker = require("../data/authData");
const errorWorker = require("../errors/authControllerErr");

async function login(req, res, next) {
  // const { email, password } = req.body;
  // const auth = req.get("authorization");
  // const check = dataWorker.checkToLogin(auth);
  // if (check) {
  //   try {
  //     const user = await dataWorker.FindUserToLogin(email);
  //     await dataWorker.MatchPasswordToLogin(password, user);
  //   } catch (err) {
  //     if (err.message === "Nonexist Email") {
  //       console.error(err);
  //       return res.status(401).json({
  //         code: 401,
  //         message: "Failed to login, The email or password are invalid",
  //       });
  //     } else if (err.message === "Invalid Password") {
  //       console.error(err);
  //       return res.status(401).json({
  //         code: 401,
  //         message: "Failed to login, The email or password are invalid",
  //       });
  //     }
  //     return next(err);
  //   }
  //   const token = dataWorker.createJwtToken(user);
  //   const result = {};
  //   result.user = user.dataValues;
  //   result.token = token;
  //   return res.status(200).json({
  //     code: 200,
  //     message: "Sucess to login and a token has been verifyed",
  //     result,
  //   });
  // } else {
  //   return res.status(401).json({
  //     code: 401,
  //     message: "You are already logged in",
  //   });
  // }
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
