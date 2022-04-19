const dataWorker = require("../data/authData");
const errorWorker = require("../errors/authControllerErr");

async function join(req, res) {
  const { usedEmail, usedNickname, usedPassword, usedReEnterPassword } =
    req.body;

  const exEmail = dataWorker.FindEmailToJoin(usedEmail);
  const exNick = dataWorker.FindNickToJoin(usedNickname);
  const isPwMatched = dataWorker.MatchPassword(
    usedPassword,
    usedReEnterPassword
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

  return res.status(201).json({
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
    try {
      const user = await dataWorker.FindUserToLogin(email);
      await dataWorker.MatchPasswordToLogin(password, user);
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
  const userSecret = req.query.secret;

  try {
    const email = await dataWorker.FindEmailToGet(userSecret);
    return res.status(200).json({
      code: 200,
      message: "Sucess to check email with user's id",
      email,
    });
  } catch (err) {
    return err.message === "Nonexist Id"
      ? res.status(401).json({
          code: 401,
          message: "Failed to find email with user's id",
          userSecret,
        })
      : next(err);
  }
}

async function changePassword(req, res) {
  const { exPassword, altPassword, reEnterPassword } = req.body;
  const { email } = req.query;

  const hashedPwPromised = dataWorker.FindPasswordWithEmail(email);
  const isPwMatchedPromised = dataWorker.MatchPassword(
    altPassword,
    reEnterPassword
  );

  const rejectedStatus = [];
  const valueArray = await Promise.allSettled([
    hashedPwPromised,
    isPwMatchedPromised,
  ]).then((settle) =>
    settle.map((res) =>
      res.status === "rejected" ? rejectedStatus.push(res.reason) : res.value
    )
  );

  if (rejectedStatus.length) {
    const error = errorWorker.changePassword(rejectedStatus);
    const result = {};

    for (let i in error.status) {
      for (let j in error.type) {
        if (i === j) result[error.type[j]] = error.status[i];
      }
    }

    return res.status(error.status[0].code).json(result);
  }

  const [hashedPassword, newPassword] = valueArray;

  try {
    await dataWorker.DisableHashing(exPassword, hashedPassword);
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      code: 401,
      message:
        "Failed to change for password, The password you entered is not your password",
    });
  }

  const hashed = dataWorker.MakeHash(newPassword);
  await dataWorker.ModifyPassword(hashed, email);
  return res.status(200).json({
    code: 200,
    message: "Sucess to change for password",
  });
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
  join,
  login,
  me,
  findEmail,
  changePassword,
};
