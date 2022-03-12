const dataWorker = require("../data/authData");

async function join(req, res, next) {
    const { email, nickname, password } = req.body;
    const message = "use to join";
    let result;

    try {
        const exEmail = await dataWorker.FindEmail(email, message);
        const exNick = await dataWorker.FindNick(nickname);
        const hash = await dataWorker.MakeHash(password);
        result = await dataWorker.MakeUser(exEmail, exNick, hash);
    } catch (err) {
        if (err.message === "Exist Email") {
            return res.status(401).json({
                code: 401,
                message: "Failed to join, The email is exist",
            });
        } else if (err.message === "Exist Nickname") {
            return res.status(401).json({
                code: 401,
                message: "Failed to join, The nickname is exist",
            });
        }
        return next(err);
    }

    return res.status(201).json({
        code: 201,
        message: "Sucess to join and a token has been verifyed",
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
            return res.status(401).json({
                code: 401,
                message: "Failed to login, The email or password are invalid",
            });
        } else if (err.message === "Invalid Password") {
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

async function me(req, res, next) {
    const nickname = req.decoded.user.nickname;
    const profile = req.decoded.user;
    return res.status(200).json({
        code: 200,
        message: "토큰은 정상입니다.",
        data: {
            nickname,
            profile,
        },
    });
}

async function logout(req, res, next) {
    req.session.destroy();
    req.logout();
    res.redirect("/");
}

module.exports = {
    join,
    login,
    me,
    logout,
};
