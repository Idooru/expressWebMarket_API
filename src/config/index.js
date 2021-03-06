import dotenv from "dotenv";
dotenv.config();

export const setting = {
  development: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "expressWebMarket_API_SERVER",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
