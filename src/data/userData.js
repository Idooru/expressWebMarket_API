const User = require("../models/users");
const bcrypt = require("bcrypt");

async function Update(package, paramsId) {
  try {
    const { email, password, nickname } = package;
    const hash = await bcrypt.hash(password, 12);
    await User.update(
      {
        email,
        password: hash,
        nickname,
      },
      {
        where: { id: paramsId },
      }
    );
  } catch (err) {
    let errMessage = err.message;
    if (errMessage === "Validation error") {
      throw new Error("same User");
    } else if (errMessage.startsWith("notNull Violation")) {
      throw new Error("form Null");
    } else throw err;
  }
}

async function GetResult(paramsId) {
  let AfterUser;

  try {
    AfterUser = await User.findOne({
      where: { id: paramsId },
    });
  } catch (err) {
    throw err;
  }

  AfterUser = AfterUser === null ? "removed" : AfterUser.dataValues;
  return AfterUser;
}

async function Destroy(paramsId) {
  try {
    await User.destroy({
      where: { id: paramsId },
    });
  } catch (err) {
    throw err;
  }
}

module.exports = { Update, GetResult, Destroy };
