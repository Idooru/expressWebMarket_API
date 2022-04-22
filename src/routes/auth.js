import express from "express";

import limiter from "../middlewares/limiter.js";
import isLogin from "../middlewares/isLogin.js";
import * as controllWorker from "../controller/authController.js";

const router = express.Router();

router.use(limiter);

router.post("/login", controllWorker.login);
router.get("/me", isLogin, controllWorker.me);

export default router;
