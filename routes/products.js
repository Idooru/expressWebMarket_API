const express = require("express");
const controllWorker = require("../controller/productController");
const router = express.Router();

router
    .route("/")
    .get(controllWorker.productQuarter)
    .get(controllWorker.getProductDetailByName)
    .get(controllWorker.getProductMain)
    .post(controllWorker.createProduct);
router
    .route("/:id")
    .get(controllWorker.getProductDetailById)
    .patch(controllWorker.modifyProduct)
    .delete(controllWorker.removeProduct);

module.exports = router;
