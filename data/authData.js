const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function FindEmail(email, message) {
    let exEmail;
    if (message === "use to join") {
        try {
            exEmail = await User.findOne({ where: { email } });
        } catch (err) {
            throw err;
        }

        if (exEmail !== null) throw new Error("Exist Email");
        return email;
    } else {
        try {
            exEmail = await User.findOne({ where: { email } });
        } catch (err) {
            throw err;
        }

        if (exEmail === null) throw new Error("Nonexist Email");
        return exEmail;
    }
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
            id: Date.now().toString(),
            email: exEmail,
            nickname: exNick,
            password: hash,
        });
    } catch (err) {
        throw err;
    }
    const token = createJwtToken(user);
    return { user, token };
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
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

module.exports = {
    FindEmail,
    FindNick,
    FindPassword,
    MakeHash,
    MakeUser,
    createJwtToken,
};
