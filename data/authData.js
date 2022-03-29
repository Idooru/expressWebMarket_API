const User = require("../models/users");
const Auth = require("../models/auths");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function checkToLogin(auth) {
    if (auth) {
        return false;
    } else {
        return true;
    }
}

async function FindEmailToJoin(email) {
    let exEmail;

    try {
        exEmail = await User.findOne({ where: { email } });
    } catch (err) {
        throw err;
    }

    if (exEmail !== null) throw new Error("Exist Email");
    return email;
}

function KnowAccountType(exEmail) {
    if (exEmail === "shere1765@gmail.com") return "master";
    else return "user";
}

async function FindUserToLogin(email) {
    let user;
    try {
        user = await User.findOne({ where: { email } });
    } catch (err) {
        throw err;
    }

    if (user === null) throw new Error("Nonexist Email");
    return user;
}

async function FindEmailToGet(id) {
    let exId;
    try {
        exId = await User.findOne({ where: { id } });
    } catch (err) {
        throw err;
    }

    if (exId === null) throw new Error("Nonexist Id");
    return exId.dataValues.email;
}

async function FindUserToCheck(email) {
    let user;

    try {
        user = await User.findOne({ where: { email } });
    } catch (err) {
        throw err;
    }

    if (user === null) throw new Error("Nonexist User");
    return user;
}

async function MatchPasswordToModify(inputedPassword, currentPassword) {
    let isPasswordCorrect;

    try {
        isPasswordCorrect = await bcrypt.compare(inputedPassword, currentPassword);
    } catch (err) {
        throw err;
    }

    if (isPasswordCorrect === false) throw new Error("Password does not match");
}

async function ModifyPassword(newPassword, userId) {
    let modifiedPassword;

    try {
        modifiedPassword = await User.update(
            {
                password: newPassword,
            },
            {
                where: { id: userId },
            }
        );
    } catch (err) {
        throw err;
    }

    return modifiedPassword;
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

function MatchPasswordToLogin(password, repassword) {
    if (password === repassword) {
        return password;
    }
    throw new Error("Password Inconsistency");
}

async function MakeHash(password) {
    let hashed;

    try {
        hashed = await bcrypt.hash(password, 12);
    } catch (err) {
        throw err;
    }

    return hashed;
}

async function MakeUser(exEmail, exNick, hash, userType) {
    let user;
    let auth;
    let result = {};
    let userSecret = (() => {
        let result = "";
        const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const characterLength = character.length;

        for (let i = 0; i < length; i++) {
            result += character.charAt(Math.floor(Math.random() * characterLength));
        }

        return result;
    })((length = 50));

    try {
        user = await User.create({
            usernumber: Date.now().toString(),
            email: exEmail,
            password: hash,
            nickname: exNick,
        });
        auth = await Auth.create({
            userType,
            userSecret,
        });
    } catch (err) {
        throw err;
    }

    result = Object.assign(user.dataValues, auth.dataValues);
    return result;
}

async function FindPassword(password, user) {
    let exPassword;

    try {
        exPassword = await bcrypt.compare(password, user.password);

        if (exPassword === false) {
            throw new Error("Invalid Password");
        }
    } catch (err) {
        throw err;
    }

    return exPassword;
}

function createJwtToken(user) {
    delete user.dataValues.password;
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

module.exports = {
    checkToLogin,
    FindEmailToJoin,
    FindEmailToGet,
    FindUserToLogin,
    FindUserToCheck,
    MatchPasswordToModify,
    ModifyPassword,
    FindNick,
    FindPassword,
    MakeHash,
    MakeUser,
    MatchPasswordToLogin,
    createJwtToken,
    KnowAccountType,
};
