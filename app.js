const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const favicon = require("serve-favicon");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");

const { sequelize } = require("./models");

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5147);

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("Sucess to connect for SQL!");
//   } catch (err) {
//     console.error(err);
//   }
// })();

sequelize.sync({ force: false });

app.use(morgan("dev"));
app.use(cors());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },

    name: "session-cookie",
  })
);
app.use(passport.initialize());
passportConfig();

const productRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

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
