const express = require("express");

const controllWorker = require("../controller/productController");
const isLogin = require("../middlewares/isLogin");
const isMaster = require("../middlewares/isMaster");

const router = express.Router();

router
    .route("/")
    .get(controllWorker.routeQuarter)
    .get(controllWorker.getProductDetailByName)
    .get(controllWorker.getProductMain)
    .post(isLogin, isMaster, controllWorker.createProduct);
router
    .route("/:id")
    .get(isLogin, isMaster, controllWorker.getProductDetailById)
    .patch(isLogin, isMaster, controllWorker.modifyProduct)
    .delete(isLogin, isMaster, controllWorker.removeProduct);

module.exports = router;
