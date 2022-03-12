const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        req.decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        console.log("Sucess to authenticate");
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(419).json({
                code: 419,
                message: "The token has expired",
            });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                code: 401,
                message: "The token is invalid",
            });
        }
    }
};
