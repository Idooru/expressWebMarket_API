const Sequelize = require("sequelize");

module.exports = class Auth extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                userType: {
                    type: Sequelize.ENUM("user", "master"),
                    allowNull: false,
                },
                userSecret: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                paranoid: false,
                modelName: "Auth",
                tableName: "auths",
            }
        );
    }
    static associate(db) {
        db.Auth.belongsTo(db.User);
    }
};
