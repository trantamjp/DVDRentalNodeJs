"use strict";
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define(
    "category",
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "category_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "category",
    }
  );

  Category.associate = function (models) {
    models.category.belongsToMany(models.film, {
      through: "filmCategory",
      foreignKey: "categoryId",
      otherKey: "filmId",
    });
  };

  return Category;
};
