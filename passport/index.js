const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/users");

const loginSet = () => {
    passport.serializeUser((user, done) => {
        console.log(`${user.dataValues.nickname}님으로 로그인합니다.`);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: id })
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                done(err);
            });
    });
    local();
};

module.exports = loginSet;
