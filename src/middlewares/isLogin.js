import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

import { Auth } from "../models/auths.js";

export default async (req, res, next) => {
  try {
    const decipher = crypto.createDecipheriv(
      process.env.JWT_ENCRYPT_ALGORITHM,
      process.env.JWT_ENCRYPT_KEY,
      process.env.JWT_ENCRYPT_IV
    );

    let decodedToken = decipher.update(
      req.cookies.authorization,
      "base64",
      "utf8"
    );
    decodedToken += decipher.final("utf8");

    req.decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);

    const userId = req.decoded.userId;
    const result = await Auth.findOne({
      where: { id: userId },
      attributes: ["userType"],
    });

    if (result.userType === "master") {
      req.isMaster = true;
      next();
    } else {
      next();
    }
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
};
