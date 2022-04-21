const express = require("express");

const controllWorker = require("../controller/userController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

// router.use("/", (req, res, next) => {
//   const { query } = req;
//   query.secret
//     ? controllWorker.findEmail(req, res, next)
//     : controllWorker.changePassword(req, res, next);
// });

router.get("/findEmail", controllWorker.findEmail);
router.post("/join", controllWorker.join);
router.post("/changePassword", controllWorker.changePassword);
router.patch("/modifyUser", controllWorker.modifyUser);
router.delete("/delete", controllWorker.removeUser);

router
  .route("/:id")
  .patch(controllWorker.modifyUser)
  .delete(controllWorker.removeUser);

module.exports = router;
