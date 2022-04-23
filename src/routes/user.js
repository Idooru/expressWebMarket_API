import express from "express";

import isLogin from "../middlewares/isLogin.js";
import limiter from "../middlewares/limiter.js";
import * as controllWorker from "../controller/userController.js";

const router = express.Router();

router.use(limiter);

router.post("/join", controllWorker.join);
router.get("/findEmail", controllWorker.findEmail);
router.post("/changePassword", controllWorker.changePassword);
router.patch("/modifyUser", isLogin, controllWorker.modifyUser);
router.delete("/removeUser", isLogin, controllWorker.removeUser);

export default router;
