const passport = require("passport");
const User = require("../models/users");
const bcrypt = require("bcrypt");

async function FindEmail(email) {
    let exEmail;

    try {
        exEmail = await User.findOne({ where: { email } });
    } catch (err) {
        throw err;
    }

    if (exEmail !== null) throw new Error("Exist Email");
    return email;
}
async function FindNick(nickname) {
    let exNick;

    try {
        exNick = await User.findOne({ where: { nickname } });
    } catch (err) {
        throw err;
    }

    if (exNick !== null) throw new Error("Exist Nickname");
    return nickname;
}

async function MakeHash(password) {
    let result;

    try {
        result = await bcrypt.hash(password, 12);
    } catch (err) {
        throw err;
    }

    return result;
}

async function MakeUser(exEmail, exNick, hash) {
    let user;

    try {
        user = await User.create({
            email: exEmail,
            nickname: exNick,
            password: hash,
        });
    } catch (err) {
        throw err;
    }

    return user;
}

async function getAuth(req, res, next) {
    try {
        passport.authenticate("local", (authError, user) => {
            if (authError) {
                return new Error(authError);
            }
            if (!user) {
                return new Error("err");
            }
            return req.login(user, (loginError) => {
                if (loginError) {
                    return next(loginError);
                }
                return res.send("로그인 되었습니다.");
            });
        })(req, res, next);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    FindEmail,
    FindNick,
    MakeHash,
    MakeUser,
    getAuth,
};
