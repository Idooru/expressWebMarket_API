import jwt from "jsonwebtoken";
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

export async function IncludeLoginStatus(userId, token) {
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
