import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Auth } from "../models/auths.js";

export async function IsLogin(userId) {
  try {
    const result = await Auth.findOne({
      where: { id: userId },
      attributes: ["isLogin"],
    });

    if (result.isLogin === "true") throw new Error("Already Login");
  } catch (err) {
    throw err;
  }
}

export function CreateJwtToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

export function EncryptJWTtoken(token) {
  const cipher = crypto.createCipheriv(
    process.env.JWT_ENCRYPT_ALGORITHM,
    process.env.JWT_ENCRYPT_KEY,
    process.env.JWT_ENCRYPT_IV
  );
  let result = cipher.update(token, "utf8", "base64");
  result += cipher.final("base64");
  return result;
}

export async function IncludeLoginStatus(userId) {
  await Auth.update(
    {
      isLogin: "true",
    },
    {
      where: { id: userId },
    }
  );
}

export async function RemoveLoginStatus(userId) {
  await Auth.update(
    {
      isLogin: "false",
    },
    {
      where: { id: userId },
    }
  );
}
