const express = require("express");
const controllWorker = require("../controller/authController");

const router = express.Router();

router.post("/join", controllWorker.join);
router.post("/login", controllWorker.login);
router.get("/logout", controllWorker.logout);

module.exports = router;
