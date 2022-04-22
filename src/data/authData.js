import jwt from "jsonwebtoken";
import { Auth } from "../models/auths.js";

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
