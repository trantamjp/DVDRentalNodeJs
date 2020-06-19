"use strict";
module.exports = (sequelize, DataTypes) => {
  var Country = sequelize.define(
    "country",
    {
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "country_id",
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "country",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "country",
    }
  );

  Country.associate = function (models) {
    models.country.hasMany(models.city, {
      foreignKey: "countryId",
      targetKey: "countryId",
    });
  };

  return Country;
};
