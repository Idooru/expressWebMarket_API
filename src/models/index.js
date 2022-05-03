import Sequelize from "sequelize";

import { setting } from "../config/index.js";
import { Product } from "./products.js";
import { User } from "./users.js";
import { Auth } from "./auths.js";

const config = process.env.NODE_ENV || setting.development;
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
db.Auth = Auth;

Product.init(sequelize);
User.init(sequelize);
Auth.init(sequelize);

User.associate(db);
Auth.associate(db);

export { db };

// import dotenv from "dotenv";
// dotenv.config();

// export const setting = {
//   development: {
//     username: "root",
//     password: process.env.SEQUELIZE_PASSWORD,
//     database: "expressWebMarket_API_SERVER",
//     host: "127.0.0.1",
//     dialect: "mysql",
//   },
//   test: {
//     username: "root",
//     password: process.env.SEQUELIZE_PASSWORD,
//     database: "database_test",
//     host: "127.0.0.1",
//     dialect: "mysql",
//   },
//   production: {
//     username: "root",
//     password: process.env.SEQUELIZE_PASSWORD,
//     database: "database_production",
//     host: "127.0.0.1",
//     dialect: "mysql",
//   },
// };
