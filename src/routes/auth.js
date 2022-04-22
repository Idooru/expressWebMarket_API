const express = require("express");

const controllWorker = require("../controller/authController");
const isLogin = require("../middlewares/isLogin");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.post("/login", controllWorker.login);
router.get("/me", isLogin, controllWorker.me);

module.exports = router;
