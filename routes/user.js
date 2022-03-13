const express = require("express");

const controllWorker = require("../controller/userController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");

const router = express.Router();

router
    .route("/:id")
    .patch(isLogin, isMaster, controllWorker.modifyUser)
    .delete(isLogin, isMaster, controllWorker.removeUser);

module.exports = router;
