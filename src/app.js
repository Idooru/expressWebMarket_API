import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import passportConfig from "./passport/index.js";
import sequelize from "./models/index.js";

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 5147);
sequelize.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Sucess to connect for SQL!");
  })
  .catch((err) => console.error(err));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
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
  return res.status(500).json({
    Error: {
      code: 500,
      error: err.message,
    },
  });
});

app.listen(app.get("port"), () => {
  console.log(
    `### API server is running at http://localhost:${app.get("port")} ###`
  );
});

// expressWebMarket_ApiServer,
