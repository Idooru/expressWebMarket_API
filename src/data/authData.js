const Sequelize = require("../models/index");
const User = require("../models/users");
const Auth = require("../models/auths");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function FindEmailToJoin(email) {
  try {
    const exEmail = await User.findOne({
      where: { email },
      attributes: ["email"],
    });
    if (exEmail !== null) throw new Error("Exist Email");
    return email;
  } catch (err) {
    throw err;
  }
}

async function FindNickToJoin(nickname) {
  try {
    const exNick = await User.findOne({
      where: { nickname },
      attributes: ["nickname"],
    });
    if (exNick !== null) throw new Error("Exist Nickname");
    return nickname;
  } catch (err) {
    throw err;
  }
}

function MatchPassword(password, repassword) {
  return new Promise((resolve, reject) =>
    password === repassword
      ? resolve(password)
      : reject(new Error("Password Inconsistency"))
  );
}

function MakeHash(password) {
  return bcrypt.hashSync(password, 12);
}

async function MakeUser(exEmail, exNick, hash) {
  try {
    return await User.create({
      id: Date.now().toString(),
      email: exEmail,
      password: hash,
      nickname: exNick,
    });
  } catch (err) {
    throw err;
  }
}

async function AddAuth(userId) {
  const userSecret = (() => {
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
    const user = await User.findOne({
      attributes: ["email"],
      where: { id: userId },
    });
    return user.email === "shere1765@gmail.com"
      ? await Auth.create({
          id: userId,
          userType: "master",
          userSecret,
        })
      : await Auth.create({
          id: userId,
          userType: "user",
          userSecret,
        });
  } catch (err) {
    throw err;
  }
}

function checkToLogin(auth) {
  return auth ? false : true;
}

async function FindUserToLogin(email) {
  try {
    const user = await User.findOne({ where: { email } });
    if (user === null) throw new Error("Nonexist Email");
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

async function FindEmailToGet(userSecret) {
  try {
    const user = await Auth.findOne({
      where: { userSecret },
      attributes: ["id"],
    });
    if (user === null) throw new Error("Nonexist Id");
    const result = await User.findOne({
      where: { id: user.id },
      attributes: ["email"],
    });
    return result.email;
  } catch (err) {
    throw err;
  }
}

async function FindPasswordWithEmail(email) {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["password"],
    });
    if (user === null) throw new Error("Nonexist Email");
    return user.password;
  } catch (err) {
    throw err;
  }
}

async function DisableHashing(exPassword, hashedPassword) {
  try {
    const isCorrect = await bcrypt.compare(exPassword, hashedPassword);
    if (!isCorrect) throw new Error("Invalid password");
  } catch (err) {
    throw err;
  }
}

async function ModifyPassword(newPassword, email) {
  try {
    await User.update(
      {
        password: newPassword,
      },
      {
        where: { email },
      }
    );
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
  FindEmailToJoin,
  FindNickToJoin,
  MatchPassword,
  MakeHash,
  MakeUser,
  AddAuth,
  checkToLogin,
  FindUserToLogin,
  MatchPasswordToLogin,
  FindEmailToGet,
  FindPasswordWithEmail,
  DisableHashing,
  ModifyPassword,
  createJwtToken,
};
