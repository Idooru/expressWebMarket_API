const { query } = require("express");
const express = require("express");

const controllWorker = require("../controller/productController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.get("/search", (req, res, next) => {
  req.query.id
    ? controllWorker.getProductDetailById(req, res, next)
    : controllWorker.getProductDetailByName(req, res, next);
});

router.get("/searchAll", controllWorker.getProductMain);

router
  .route("/operation")
  .post(isLogin, isMaster, controllWorker.createProduct)
  .patch(isLogin, isMaster, controllWorker.modifyProduct)
  .delete(isLogin, isMaster, controllWorker.removeProduct);

module.exports = router;
