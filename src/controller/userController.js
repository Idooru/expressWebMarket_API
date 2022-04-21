const dataWorker = require("../data/userData");
const errorWorker = require("../errors/userControllerErr");
const bcrypt = require("bcrypt");

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
    const error = errorWorker.promiseOnJoin(rejectedStatus);
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
    errorWorker.FindEmailToGet(err, res, next);
  }
}

async function changePassword(req, res, next) {
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
    const error = errorWorker.promiseOnChangePassword(rejectedStatus);
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
    errorWorker.DisableHashing(err, res, next);
  }

  const hashed = dataWorker.MakeHash(newPassword);
  await dataWorker.ModifyPassword(hashed, email);

  return res.status(200).json({
    code: 200,
    message: "Sucess to change for password",
  });
}

async function modifyUser(req, res, next) {
  const userId = req.params.id;
  const package = req.body;

  try {
    const hashed = bcrypt.hashSync(package.password, 12);
    package.password = hashed;

    await dataWorker.Update(package, userId);
    const purpose = "Update";
    const result = await dataWorker.GetResult(userId, purpose);

    return res.status(200).json({
      code: 200,
      message: "The user's info has been modified",
      result,
    });
  } catch (err) {
    err.message === "No User"
      ? errorWorker.getResult(err, res, next)
      : errorWorker.updateUser(err, res, next);
  }
}

async function removeUser(req, res, next) {
  const userId = req.query.id;

  try {
    await dataWorker.Destroy(userId);
    const purpose = "Delete";
    await dataWorker.GetResult(userId, purpose);
    return res.status(203).json({
      code: 203,
      message: "The user's info has been removed",
    });
  } catch (err) {
    errorWorker.getResult(err, res, next);
  }
}

module.exports = { join, findEmail, changePassword, modifyUser, removeUser };
