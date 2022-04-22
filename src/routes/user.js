import express from "express";

import * as controllWorker from "../controller/productController.js";
import isLogin from "../models/isLogin.js";
import limiter from "../models/limiter";

const router = express.Router();

router.use(limiter);

router.post("/join", controllWorker.join);
router.get("/findEmail", controllWorker.findEmail);
router.post("/changePassword", controllWorker.changePassword);
router.patch("/modifyUser", isLogin, controllWorker.modifyUser);
router.delete("/removeUser", isLogin, controllWorker.removeUser);

export default router;
