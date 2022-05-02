import jwt from "jsonwebtoken";
import { Auth } from "../models/auths.js";

export async function isJwtExist(userId) {
  try {
    const isToken = await Auth.findOne({
      where: { id: userId },
      attributes: ["haveJWTtoken"],
    });

    if (isToken.haveJWTtoken) throw new Error("Token is exist");
  } catch (err) {
    throw err;
  }
}

export function CreateJwtToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

export async function IncludeJwtOnAuth(userId, token) {
  await Auth.update(
    {
      haveJWTtoken: token,
    },
    {
      where: { id: userId },
    }
  );
}

export async function RemoveJwtOnAuth(userId) {
  await Auth.update(
    {
      haveJWTtoken: "",
    },
    {
      where: { id: userId },
    }
  );
}
