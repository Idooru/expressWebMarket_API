import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import passportConfig from "./passport/index.js";
import { db } from "./models/index.js";

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 5147);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

passportConfig();

import productRouter from "./routes/product.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

app.use("/products", productRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} does not exist`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return err.status === 404
    ? res.status(err.status).json({
        Not_Found_ERROR: {
          code: 404,
          error: err.message,
        },
      })
    : res.status(500).json({
        Error: {
          code: 500,
          error: err.message,
        },
      });
});

app.listen(app.get("port"), () => {
  db.sequelize
    .sync({ force: false })
    .then(() => console.log("Sucess to connect for SQL!"))
    .catch((err) => console.error(err));
  console.log(
    `### API server is running at http://localhost:${app.get("port")} ###`
  );
});

// expressWebMarket_ApiServer,
