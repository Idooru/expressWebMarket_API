const User = require("../models/users");
const Auth = require("../models/auths");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function checkToLogin(auth) {
  if (auth) {
    return false;
  } else {
    return true;
  }
}

async function FindEmailToJoin(email) {
  let exEmail;

  try {
    exEmail = await User.findOne({ where: { email }, attributes: ["email"] });
  } catch (err) {
    throw err;
  }

  if (exEmail !== null) throw new Error("Exist Email");
  return email;
}

async function FindUserToLogin(email) {
  let user;
  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    throw err;
  }

  if (user === null) throw new Error("Nonexist Email");
  return user;
}

async function FindId(querySecret) {
  let exId;
  try {
    exId = await Auth.findOne({
      where: { userSecret: querySecret },
      attributes: ["id"],
    });
  } catch (err) {
    throw err;
  }
  exId = exId.id;

  if (exId === null) throw new Error("Nonexist Id");
  return exId;
}

async function FindEmailToGet(id) {
  let exEmail;
  try {
    exEmail = await User.findOne({
      where: { id },
      attributes: ["email"],
    });
  } catch (err) {
    throw err;
  }
  exEmail = exEmail.email;

  return exEmail;
}

async function FindUserToCheck(email) {
  let user;

  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    throw err;
  }

  if (user === null) throw new Error("Nonexist User");
  return user;
}

async function MatchPasswordToModify(inputedPassword, currentPassword) {
  let isPasswordCorrect;

  try {
    isPasswordCorrect = await bcrypt.compare(inputedPassword, currentPassword);
  } catch (err) {
    throw err;
  }

  if (isPasswordCorrect === false) throw new Error("Password does not match");
}

async function ModifyPassword(newPassword, userId) {
  let modifiedPassword;

  try {
    modifiedPassword = await User.update(
      {
        password: newPassword,
      },
      {
        where: { id: userId },
      }
    );
  } catch (err) {
    throw err;
  }

  return modifiedPassword;
}

async function FindNick(nickname) {
  let exNick;

  try {
    exNick = await User.findOne({ where: { nickname } });
  } catch (err) {
    throw err;
  }

  if (exNick !== null) throw new Error("Exist Nickname");
  return nickname;
}

function MatchPasswordToLogin(password, repassword) {
  if (password === repassword) {
    return password;
  }
  throw new Error("Password Inconsistency");
}

async function MakeHash(password) {
  let hashed;

  try {
    hashed = await bcrypt.hash(password, 12);
  } catch (err) {
    throw err;
  }

  return hashed;
}

async function MakeUser(exEmail, exNick, hash) {
  let user;

  try {
    user = await User.create({
      id: Date.now().toString(),
      email: exEmail,
      password: hash,
      nickname: exNick,
    });
  } catch (err) {
    throw err;
  }

  return user;
}

async function AddAuth(userId) {
  let auth;
  let userEmail;
  let userSecret = (() => {
    let result = "";
    const character =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const characterLength = character.length;

    for (let i = 0; i < length; i++) {
      result += character.charAt(Math.floor(Math.random() * characterLength));
    }

    return result;
  })((length = 50));

  try {
    userEmail = await User.findOne({
      where: { id: userId },
      attributes: ["email"],
    });
    userEmail = userEmail.email;

    if (userEmail === "shere1765@gmail.com") {
      auth = await Auth.create({
        id: userId,
        userType: "master",
        userSecret,
      });
      return auth;
    } else {
      auth = await Auth.create({
        id: userId,
        userType: "user",
        userSecret,
      });
      return auth;
    }
  } catch (err) {
    throw err;
  }
}

async function FindPassword(password, user) {
  let exPassword;

  try {
    exPassword = await bcrypt.compare(password, user.password);

    if (exPassword === false) {
      throw new Error("Invalid Password");
    }
  } catch (err) {
    throw err;
  }

  return exPassword;
}

function createJwtToken(user) {
  delete user.dataValues.password;
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = {
  checkToLogin,
  FindEmailToJoin,
  FindEmailToGet,
  FindUserToLogin,
  FindUserToCheck,
  MatchPasswordToModify,
  ModifyPassword,
  FindId,
  FindNick,
  FindPassword,
  MakeHash,
  MakeUser,
  AddAuth,
  MatchPasswordToLogin,
  createJwtToken,
};
