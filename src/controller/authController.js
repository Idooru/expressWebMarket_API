import passport from "passport";
import * as dataWorker from "../data/authData.js";
import * as errorWorker from "../errors/authErr.js";

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

        try {
          await dataWorker.isJwtExist(userId);
        } catch (err) {
          errorWorker.isJwtExist(err, res, next);
          return;
        }

        const userType = user.type;
        const whenLogin = new Date().toString();
        const data = { userId, userType, whenLogin };
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

export async function logout(req, res) {
  const userId = req.decoded.userId;
  await dataWorker.RemoveJwtOnAuth(userId);
  res.cookie("jwt", "");
  res.status(200).json({
    code: 200,
    message: "Sucess to logout",
  });
}
