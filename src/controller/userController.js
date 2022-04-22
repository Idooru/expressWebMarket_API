import bcrypt from "bcrypt";

import * as dataWorker from "../data/userData.js";
import * as errorWorker from "../errors/userControllerErr.js";

export async function join(req, res) {
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

export async function findEmail(req, res, next) {
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

export async function changePassword(req, res, next) {
  const { altPassword, reEnterPassword } = req.body;
  const { email } = req.query;

  const exUser = dataWorker.FindEmailToUser(email);
  const isPwMatched = dataWorker.MatchPassword(altPassword, reEnterPassword);

  const rejectedStatus = [];
  const valueArray = await Promise.allSettled([exUser, isPwMatched]).then(
    (settle) =>
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

  const [user, newPassword] = valueArray;

  const hashed = dataWorker.MakeHash(newPassword);
  await dataWorker.ModifyPassword(hashed, user.email);

  return res.status(200).json({
    code: 200,
    message: "Sucess to change for password",
  });
}

export async function modifyUser(req, res, next) {
  const userId = req.query.id;
  const payload = req.body;

  try {
    const hashed = bcrypt.hashSync(payload.password, 12);
    payload.password = hashed;

    await dataWorker.Update(payload, userId);
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

export async function removeUser(req, res, next) {
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
