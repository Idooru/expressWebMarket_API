const dataWorker = require("../data/authData");
const errorWorker = require("../errors/authControllerErr");

async function join(req, res) {
  const { usedEmail, usedNickname, usedPassword, usedRepassword } = req.body;

  const exEmail = dataWorker.FindEmailToJoin(usedEmail);
  const exNick = dataWorker.FindNick(usedNickname);
  const isPwMatched = dataWorker.MatchPasswordToLogin(
    usedPassword,
    usedRepassword
  );

  const rejectedStatus = [];

  const valueArray = await Promise.allSettled([
    exEmail,
    exNick,
    isPwMatched,
  ]).then((settle) =>
    settle.map((res) =>
      res.status === "rejected" ? rejectedStatus.push(res.reason) : res.value
    )
  );

  if (rejectedStatus.length) {
    const error = errorWorker.join(rejectedStatus);
    const result = {};

    for (let i in error.status) {
      for (let j in error.type) {
        if (i === j) result[error.type[j]] = error.status[i];
      }
    }
    return res.status(error.status[0].code).json(result);
  }

  const [email, nickname, password] = valueArray;
  const hash = dataWorker.MakeHash(password);

  const user = await dataWorker.MakeUser(email, nickname, hash);
  const userId = user.id;
  const auth = await dataWorker.AddAuth(userId);

  const createdUser = Object.assign(user.dataValues, auth.dataValues);

  res.status(201).json({
    code: 201,
    message: "Sucess to join, and do not forget userSecret",
    createdUser,
  });
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
};
