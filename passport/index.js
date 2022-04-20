const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const passportConfig = { usernameField: "email", passwordField: "password" };

const passportVerify = async (email, password, done) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({
      where: { email },
    });
    // 검색된 유저가 없다면 에러 표시
    if (!user) {
      return done(null, false, { reason: "존재하지 않은 사용자입니다." });
    }
    // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
    const compareResult = await bcrypt.compare(password, user.password);
    // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      return done(null, user);
    }
    // 비밀번호가 다를경우 에러 표시
    done(null, false, { reason: "올바르지 않은 비밀번호입니다." });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passportVerify));
};
