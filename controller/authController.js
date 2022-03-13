const dataWorker = require("../data/authData");
const jwt = require("jsonwebtoken");

async function join(req, res, next) {
    const { email, nickname, password, repassword } = req.body;
    const message = "use to join";
    let result;

    try {
        const exEmail = await dataWorker.FindEmail(email, message);
        const exNick = await dataWorker.FindNick(nickname);
        const exPass = dataWorker.MatchPass(password, repassword);
        const hash = await dataWorker.MakeHash(exPass);
        result = await dataWorker.MakeUser(exEmail, exNick, hash);
    } catch (err) {
        if (err.message === "Exist Email") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to join, The email is exist",
            });
        } else if (err.message === "Exist Nickname") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to join, The nickname is exist",
            });
        } else if (err.message === "Password Inconsistency") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to join, The password is not matching",
            });
        }
        return next(err);
    }

    return res.status(201).json({
        code: 201,
        message: "Sucess to join",
        result,
    });
}

async function login(req, res, next) {
    const { email, password } = req.body;
    const message = "use to login";
    let user;

    try {
        user = await dataWorker.FindEmail(email, message);
        await dataWorker.FindPassword(password, user);
    } catch (err) {
        if (err.message === "Nonexist Email") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to login, The email or password are invalid",
            });
        } else if (err.message === "Invalid Password") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to login, The email or password are invalid",
            });
        }
        return next(err);
    }
    const token = dataWorker.createJwtToken(user);
    const result = {};

    result.user = user;
    result.token = token;
    return res.status(200).json({
        code: 200,
        message: "Sucess to login and a token has been verifyed",
        result,
    });
}

async function me(req, res) {
    const nickname = req.decoded.user.nickname;
    const authority = req.authority;
    if (req.authority === "master") {
        return res.status(200).json({
            code: 200,
            message: "The token is valid, welcome master",
            nickname,
            authority,
        });
    }
    return res.status(200).json({
        code: 200,
        message: "The tokein is valid",
        nickname,
        authority,
    });
}

async function logout(req, res, next) {
    let jwtToken = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
    );
    jwtToken = "";

    return res.status(200).json({
        code: 200,
        message: "Sucess to logout",
        jwtToken,
    });
}

module.exports = {
    join,
    login,
    me,
    logout,
};
