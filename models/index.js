const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const Product = require("./products");
const User = require("./users");

const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;
db.Product = Product;
db.User = User;

Product.init(sequelize);
User.init(sequelize);

module.exports = db;
