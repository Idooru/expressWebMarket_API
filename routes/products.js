const express = require("express");

const controllWorker = require("../controller/productController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");
const limiter = require("../middlewares/limiter");

const router = express.Router();

router.use(limiter);
router
  .route("/")
  .get(controllWorker.routeQuarter)
  .get(controllWorker.getProductDetailByName)
  .get(controllWorker.getProductMain)
  .post(isLogin, isMaster, controllWorker.createProduct);
router
  .route("/:id")
  .get(controllWorker.getProductDetailById)
  .patch(isLogin, isMaster, controllWorker.modifyProduct)
  .delete(isLogin, isMaster, controllWorker.removeProduct);

module.exports = router;
