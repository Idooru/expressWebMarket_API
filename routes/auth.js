const express = require("express");

const controllWorker = require("../controller/authController");
const isLogin = require("../middlewares/isLogin");
const whoami = require("../middlewares/whoami");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.use("/user", (req, res, next) => {
  const { query } = req;
  query.secret
    ? controllWorker.findEmail(req, res, next)
    : controllWorker.changePassword(req, res, next);
});

router.get("/user", controllWorker.findEmail);
router.post("/user", controllWorker.changePassword);
router.post("/join", controllWorker.join);
router.post("/login", controllWorker.login);
router.get("/me", isLogin, whoami, controllWorker.me);

module.exports = router;
