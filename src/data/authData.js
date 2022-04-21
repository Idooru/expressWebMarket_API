const User = require("../models/users");
const Auth = require("../models/auths");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function checkToLogin(auth) {
  return auth ? false : true;
}

async function FindUserToLogin(email) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Nonexist Email");
    return user;
  } catch (err) {
    throw err;
  }
}

async function MatchPasswordToLogin(email, password) {
  try {
    const user = await User.findOne({
      where: { email },
    });
    const exPassword = await bcrypt.compare(password, user.password);

    if (exPassword === false) throw new Error("Invalid Password");
    return exPassword;
  } catch (err) {
    throw err;
  }
}

function createJwtToken(user) {
  delete user.dataValues.password;
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = {
  checkToLogin,
  FindUserToLogin,
  MatchPasswordToLogin,
  createJwtToken,
};
