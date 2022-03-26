const User = require("../models/users");
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

async function MatchPasswordToModify(nowPassword, userPassword) {
    let isPasswordCorrect;

    try {
        isPasswordCorrect = await bcrypt.compare(nowPassword, userPassword);
    } catch (err) {
        throw err;
    }

    if (isPasswordCorrect === false) throw new Error("Password does not match");
    return isPasswordCorrect;
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

async function MakeUser(exEmail, exNick, hash) {
    let user;

    try {
        user = await User.create({
            id: Date.now().toString(),
            email: exEmail,
            nickname: exNick,
            password: hash,
        });
    } catch (err) {
        throw err;
    }

    return user;
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
    FindNick,
    FindPassword,
    MakeHash,
    MakeUser,
    MatchPasswordToLogin,
    createJwtToken,
};
