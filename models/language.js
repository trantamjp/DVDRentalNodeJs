"use strict";
module.exports = (sequelize, DataTypes) => {
  var Language = sequelize.define(
    "language",
    {
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "language_id",
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
      tableName: "language",
    }
  );

  Language.associate = function (models) {
    models.language.hasMany(models.film, {
      foreignKey: "languageId",
      targetKey: "languageId",
    });
  };

  return Language;
};
