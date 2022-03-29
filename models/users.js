const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                usernumber: {
                    type: Sequelize.STRING(25),
                    unique: true,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING(25),
                    unique: true,
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                nickname: {
                    type: Sequelize.STRING(15),
                    unique: true,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                paranoid: false,
                modelName: "User",
                tableName: "users",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        db.User.hasOne(db.Auth);
    }
};
