const User = require("../models/users");
const Auth = require("../models/auths");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function CheckToLogin(auth) {
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

function CreateJwtToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

async function IncludeJwtOnAuth(userId, token) {
  await Auth.update(
    {
      haveJWTtoken: token,
    },
    {
      where: { id: userId },
    }
  );
}

module.exports = {
  CheckToLogin,
  FindUserToLogin,
  MatchPasswordToLogin,
  CreateJwtToken,
  IncludeJwtOnAuth,
};
