import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import pkg1 from "passport-local";

const LocalStrategy = pkg1;

import bcrypt from "bcrypt";

import { User } from "../models/users.js";
import { Auth } from "../models/auths.js";

const passportConfig = { usernameField: "email", passwordField: "password" };
const passprotVerify = async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, {
        Email_ERROR: {
          code: 401,
          message: "Failed to login, The email does not exist",
        },
      });
    }
    const userId = user.id;
    const result = await Auth.findOne({
      where: { id: userId },
      attributes: ["userType"],
    });
    user.type = result.userType;

    const comparePassword = await bcrypt.compare(password, user.password);
    comparePassword
      ? done(null, user)
      : done(null, false, {
          Password_ERROR: {
            code: 401,
            message: "Failed to login, The password does not exist",
          },
        });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

export default () => {
  passport.use("local", new LocalStrategy(passportConfig, passprotVerify));
};
