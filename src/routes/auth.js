const express = require("express");

const controllWorker = require("../controller/authController");
const isLogin = require("../middlewares/isLogin");
const whoami = require("../middlewares/whoami");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.post("/login", controllWorker.login);
router.get("/me", isLogin, whoami, controllWorker.me);

module.exports = router;
