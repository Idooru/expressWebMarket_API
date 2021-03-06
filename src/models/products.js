import Sequelize from "sequelize";

export class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
          unique: true,
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
