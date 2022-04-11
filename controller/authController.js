const dataWorker = require("../data/authData");

async function routeQuarter(req, res, next) {
  const { query } = req;
  query.secret ? findEmail(req, res, next) : changePassword(req, res, next);
}

async function join(req, res, next) {
  const { email, nickname, password, repassword } = req.body;

  const exEmail = dataWorker.FindEmailToJoin(email);
  const exNick = dataWorker.FindNick(nickname);
  const matchedPass = dataWorker.MatchPasswordToLogin(password, repassword);
  const hash = dataWorker.MakeHash(matchedPass);
  const promiseStatus = [];

  const valid = await Promise.allSettled([exEmail, exNick, hash]);

  valid.filter((err) => {
    if (err.status === "rejected") promiseStatus.push(err);
  });

  if (promiseStatus) {
    for (let i of promiseStatus) {
      switch (i.reason.message) {
        case "Exist Email":
          console.error(i.reason);
          return res.status(401).json({
            code: 401,
            message: "Failed to join, The email is exist",
          });
        case "Exist Nickname":
          console.error(i.reason);
          return res.status(401).json({
            code: 401,
            message: "Failed to join, The nickname is exist",
          });
        case "Password Inconsistency":
          console.error(i.reason);
          return res.status(401).json({
            code: 401,
            message: "Failed to join, The password is not matching",
          });
        default:
          return next(i.reason);
      }
    }
  }

  const user = dataWorker.MakeUser(exEmail, exNick, hash);
  const userId = user.id;
  const auth = dataWorker.AddAuth(userId);
  const checked = await Promise.allSettled([
    exEmail,
    exNick,
    matchedPass,
    hash,
    user,
  ]);

  // try {
  //   const exEmail = await dataWorker.FindEmailToJoin(email);
  //   const exNick = await dataWorker.FindNick(nickname);
  //   const matchedPass = dataWorker.MatchPasswordToLogin(password, repassword);
  //   const hash = await dataWorker.MakeHash(matchedPass);

  //   user = await dataWorker.MakeUser(exEmail, exNick, hash);
  //   userId = user.id;
  //   auth = await dataWorker.AddAuth(userId);
  // } catch (err) {
  //   if (err.message === "Exist Email") {
  //     console.error(err);
  //     return res.status(401).json({
  //       code: 401,
  //       message: "Failed to join, The email is exist",
  //     });
  //   } else if (err.message === "Exist Nickname") {
  //     console.error(err);
  //     return res.status(401).json({
  //       code: 401,
  //       message: "Failed to join, The nickname is exist",
  //     });
  //   } else if (err.message === "Password Inconsistency") {
  //     console.error(err);
  //     return res.status(401).json({
  //       code: 401,
  //       message: "Failed to join, The password is not matching",
  //     });
  //   }
  //   return next(err);
  // }

  // result = Object.assign(user.dataValues, auth.dataValues);

  // return res.status(201).json({
  //   code: 201,
  //   message: "Sucess to join, and do not forget userSecret",
  //   result,
  // });

  res.json({ status: "test" });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const auth = req.get("authorization");
  const check = dataWorker.checkToLogin(auth);
  if (check) {
    let user;

    try {
      user = await dataWorker.FindUserToLogin(email);
      await dataWorker.FindPassword(password, user);
    } catch (err) {
      if (err.message === "Nonexist Email") {
        console.error(err);
        return res.status(401).json({
          code: 401,
          message: "Failed to login, The email or password are invalid",
        });
      } else if (err.message === "Invalid Password") {
        console.error(err);
        return res.status(401).json({
          code: 401,
          message: "Failed to login, The email or password are invalid",
        });
      }
      return next(err);
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
  } else {
    return res.status(401).json({
      code: 401,
      message: "You are already logged in",
    });
  }
}

async function findEmail(req, res, next) {
  const querySecret = req.query.secret;
  let id;
  let result;

  try {
    id = await dataWorker.FindId(querySecret);
    result = await dataWorker.FindEmailToGet(id);
  } catch (err) {
    if (err.message === "Nonexist Id") {
      return res.status(401).json({
        code: 401,
        message: "Failed to find email with user's id",
      });
    }
    console.error(err);
    return next(err);
  }

  return res.status(200).json({
    code: 200,
    message: "Sucess to check email with user's id",
    result,
  });
}

async function changePassword(req, res, next) {
  const { inputedPassword, newPassword } = req.body;
  const { email } = req.query;
  let hashed;

  try {
    const user = await dataWorker.FindUserToCheck(email);
    const currentPassword = user.password;
    const userId = user.dataValues.id;

    await dataWorker.MatchPasswordToModify(inputedPassword, currentPassword);
    hashed = await dataWorker.MakeHash(newPassword);
    await dataWorker.ModifyPassword(hashed, userId);
  } catch (err) {
    if (err.message === "Nonexist User") {
      return res.status(401).json({
        code: 401,
        message: "Failed to find, The user is nonexist",
      });
    } else if (err.message === "Password does not match") {
      return res.status(401).json({
        code: 401,
        message: "These passwords do not match",
      });
    }
    console.error(err);
    return next(err);
  }

  res.status(200).json({
    code: 200,
    message: "Sucess to modify password",
  });
}

async function me(req, res) {
  const nickname = req.decoded.user.nickname;
  const authority = req.authority;
  if (req.authority === "master") {
    return res.status(200).json({
      code: 200,
      message: "The token is valid, welcome master",
      nickname,
      authority,
    });
  }
  return res.status(200).json({
    code: 200,
    message: "The tokein is valid",
    nickname,
    authority,
  });
}

module.exports = {
  join,
  login,
  me,
  findEmail,
  changePassword,
  routeQuarter,
};
