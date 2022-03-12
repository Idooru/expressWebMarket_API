const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const favicon = require("serve-favicon");
const nunjucks = require("nunjucks");
const session = require("express-session");

const { sequelize } = require("./models");

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5147);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("SQL 연결 성공!");
    })
    .catch(console.error);

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
    console.log(" ### Error Detected! ###");
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.locals.error.status = 500;
    console.error(err);
    res.status(500).render("error");
});

app.listen(app.get("port"), () => {
    console.log(
        `### API server is running at http://localhost:${app.get("port")} ###`
    );
});

// expressWebMarket_ApiServer
