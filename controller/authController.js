const dataWorker = require("../data/authData");

async function join(req, res, next) {
    const { email, nickname, password } = req.body;
    let user;

    try {
        const exEmail = await dataWorker.FindEmail(email);
        const exNick = await dataWorker.FindNick(nickname);
        const hash = await dataWorker.MakeHash(password);
        user = await dataWorker.MakeUser(exEmail, exNick, hash);
    } catch (err) {
        return next(err);
    }

    console.log(`user has been created like this ${user.dataValues}`);
    res.status(201).redirect("/");
}

async function login(req, res, next) {
    try {
        dataWorker.getAuth(req, res, next);
    } catch (err) {
        return next(err);
    }
}

async function logout(req, res, next) {
    req.session.destroy();
    req.logout();
    res.redirect("/");
}

module.exports = {
    join,
    login,
    logout,
};
