const express = require("express");

const controllWorker = require("../controller/userController");
const isLogin = require("../middlewares/isLogin");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.post("/join", controllWorker.join);
router.get("/findEmail", controllWorker.findEmail);
router.post("/changePassword", controllWorker.changePassword);
router.patch("/modifyUser", isLogin, controllWorker.modifyUser);
router.delete("/removeUser", isLogin, controllWorker.removeUser);

module.exports = router;
