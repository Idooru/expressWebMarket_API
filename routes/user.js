const express = require("express");

const controllWorker = require("../controller/userController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);
router
  .route("/:id")
  .patch(isLogin, isMaster, controllWorker.modifyUser)
  .delete(isLogin, isMaster, controllWorker.removeUser);

module.exports = router;
