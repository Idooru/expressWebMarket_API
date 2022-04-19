const { query } = require("express");
const express = require("express");

const controllWorker = require("../controller/productController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);

router.route("/search").get((req, res, next) => {
  // const query =
  //   req.query !== {}
  //     ? req.query
  //     : controllWorker.getProductMain(req, res, next);
  // query.id
  //   ? controllWorker.getProductDetailById(req, res, next)
  //   : controllWorker.getProductDetailByName(req, res, next);

  // if (Object.keys(req.query).length) {
  //   if (req.query.id) {
  //     controllWorker.getProductDetailById(req, res, next);
  //   } else {
  //     controllWorker.getProductDetailByName(req, res, next);
  //   }
  // } else {
  //   controllWorker.getProductMain(req, res, next);
  // }

  const query = Object.keys(req.query).length
    ? req.query
    : controllWorker.getProductMain(req, res, next);
  query.id
    ? controllWorker.getProductDetailById(req, res, next)
    : controllWorker.getProductDetailByName(req, res, next);
});

router
  .route("/operation")
  .post(controllWorker.createProduct)
  .patch(controllWorker.modifyProduct)
  .delete(controllWorker.removeProduct);

module.exports = router;
