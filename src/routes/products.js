import express from "express";

import isLogin from "../models/isLogin.js";
import isMaster from "../models/isMaster.js";
import limiter from "../models/limiter";
import * as controllWorker from "../controller/productController.js";

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

export default router;
