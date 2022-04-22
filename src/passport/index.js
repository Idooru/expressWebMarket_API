const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const Auth = require("../models/auths");

const passportConfig = { usernameField: "email", passwordField: "password" };
const passprotVerify = async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, {
        Login_ERROR: {
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
          Login_ERROR: {
            code: 401,
            message: "Failed to login, The password does not exist",
          },
        });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_SECRET,
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    if (user) {
      return done(null, user);
    }
    done(null, false, {
      Login_ERROR: {
        code: 401,
        message: "Failed to login, The token is invalid",
      },
    });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passprotVerify));
  passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
};
