const Sequelize = require("sequelize");

class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.STRING(13),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                price: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                origin: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                type: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                paranoid: false,
                underscored: false,
                modelName: "Product",
                tableName: "products",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
}

module.exports = Product;
