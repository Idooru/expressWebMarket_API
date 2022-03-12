const express = require("express");

const controllWorker = require("../controller/authController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/join", controllWorker.join);
router.post("/login", controllWorker.login);
router.get("/me", auth, controllWorker.me);
router.get("/logout", auth, controllWorker.logout);

module.exports = router;
