import Sequelize from "sequelize";

export class Auth extends Sequelize.Model {
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
        isLogin: {
          type: Sequelize.ENUM("true", "false"),
          allowNull: true,
          unique: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        paranoid: false,
        modelName: "Auth",
        tableName: "auths",
      }
    );
  }
  static associate(db) {
    db.Auth.belongsTo(db.User, { sourceKey: "id" });
  }
}
