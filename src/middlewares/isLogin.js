import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Auth } from "../models/auths.js";

export default async function test(req, res, next) {
  try {
    req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const userId = req.decoded.userId;
    const result = await Auth.findOne({
      where: { id: userId },
      attributes: ["userType"],
    });
    return result.userType === "master"
      ? ((req.isMaster = true), next())
      : next();
  } catch (err) {
    return err.name === "TokenExpiredError"
      ? res.status(419).json({
          Token_ERROR: {
            code: 419,
            message: "The token has expired",
          },
        })
      : res.status(401).json({
          Token_ERROR: {
            code: 401,
            message: "The token is invalid",
          },
        });
  }
}
