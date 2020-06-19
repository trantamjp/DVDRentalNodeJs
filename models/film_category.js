"use strict";
module.exports = (sequelize, DataTypes) => {
  var FilmCategory = sequelize.define(
    "filmCategory",
    {
      filmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "film_id",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "category_id",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "film_category",
    }
  );

  // FilmCategory.associate = function (models) {
  //   models.filmCategory.belongsTo(models.category, {
  //     foreignKey: "categoryId",
  //     targetKey: "categoryId",
  //   });
  //   models.filmCategory.belongsTo(models.film, {
  //     foreignKey: "filmId",
  //     targetKey: "filmId",
  //   });
  // };

  return FilmCategory;
};
