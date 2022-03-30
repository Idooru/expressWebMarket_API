const jwt = require("jsonwebtoken");
const Auth = require("../models/auths");

module.exports = async (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const userId = req.decoded.user.id;
        let userType = await Auth.findOne({
            where: { id: userId },
            attributes: ["userType"],
        });
        userType = userType.userType;

        if (userType === "master") {
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
