import bcrypt from "bcrypt";

import { User } from "../models/users.js";
import { Auth } from "../models/auths.js";

export async function FindEmailToJoin(email) {
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

export async function FindNickToJoin(nickname) {
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

export async function MakeUser(exEmail, exNick, hash) {
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

export async function AddAuth(userId) {
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
          haveJWTtoken: "",
        })
      : await Auth.create({
          id: userId,
          userType: "user",
          userSecret,
          haveJWTtoken: "",
        });
  } catch (err) {
    throw err;
  }
}

export async function FindEmailToGet(userSecret) {
  try {
    const user = await Auth.findOne({
      where: { userSecret },
      attributes: ["id"],
    });
    if (!user) {
      const error = new Error("Nonexist Id");
      error.userSecret = userSecret;
      throw error;
    }
    const result = await User.findOne({
      where: { id: user.id },
      attributes: ["email"],
    });
    return result.email;
  } catch (err) {
    throw err;
  }
}

export async function FindEmailToUser(email) {
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) throw new Error("Nonexist Email");
    return user;
  } catch (err) {
    throw err;
  }
}

export async function DisableHashing(exPassword, hashedPassword) {
  try {
    const isCorrect = await bcrypt.compare(exPassword, hashedPassword);
    if (!isCorrect) throw new Error("Invalid password");
  } catch (err) {
    throw err;
  }
}

export async function ModifyPassword(newPassword, email) {
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

export async function Update(payload, userId) {
  try {
    await User.update(payload, {
      where: { id: userId },
    });
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same User") : err;
  }
}

export async function Destroy(userId) {
  try {
    await User.destroy({
      where: { id: userId },
    });
  } catch (err) {
    throw err;
  }
}

export async function GetResult(userId, purpose) {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("No User");
      error.id = userId;
      error.purpose = purpose === "Update" ? "Update" : "Delete";
      throw error;
    }

    return user;
  } catch (err) {
    throw err;
  }
}
