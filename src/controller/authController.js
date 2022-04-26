import passport from "passport";
import * as dataWorker from "../data/authData.js";

export function login(req, res, next) {
  try {
    passport.authenticate("local", (error, user, info) => {
      if (error || !user) {
        return res.status(401).json(info);
      }

      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          return next(loginError);
        }

        const userId = user.id;
        const userType = user.type;
        const data = { userId, userType, status: "login" };
        const token = dataWorker.CreateJwtToken(data);
        const result = {};

        result.data = data;
        result.token = token;

        await dataWorker.IncludeJwtOnAuth(userId, token);

        return res.status(200).cookie("jwt", token).json({
          code: 200,
          message: "Sucess to login and a token has been verifyed",
          result,
        });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

export async function me(req, res) {
  const authority = req.isMaster ? "master" : "user";
  const userId = req.decoded.userId;

  const result =
    authority === "master"
      ? {
          code: 200,
          message: "The token is valid, welcome master",
          userId,
          authority,
        }
      : {
          code: 200,
          message: "The token is valid",
          userId,
          authority,
        };

  return res.status(200).json(result);
}
