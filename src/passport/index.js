const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const bcrypt = require("bcrypt");

const User = require("../models/users");

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

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passprotVerify));
};
