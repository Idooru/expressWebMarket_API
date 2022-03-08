const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const favicon = require("serve-favicon");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");

const { sequelize } = require("./models");

dotenv.config();

const app = express();
passportConfig();
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

app.use(passport.initialize());
app.use(passport.session());

const productRouter = require("./routes/products.js");
const authRouter = require("./routes/auth");
const errPro = require("./errors/errorProcessor");

app.get("/", (req, res) => {
    res.status(200).render("expressAPI.html");
});

app.use("/products", productRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} does not exist`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.log(" ### Error Detected! ###");
    errPro(err, res);
});

app.listen(app.get("port"), () => {
    console.log(
        `### API server is running at http://localhost:${app.get("port")} ###`
    );
});

// expressWebMarket_ApiServer
