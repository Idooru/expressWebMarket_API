const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        req.decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        if (req.decoded.user.email === process.env.MASTER_USER) {
            req.isMaster = true;
            return next();
        }

        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(419).json({
                code: 419,
                message: "The token has expired",
            });
        }
        return res.status(401).json({
            code: 401,
            message: "The token is invalid",
        });
    }
};
