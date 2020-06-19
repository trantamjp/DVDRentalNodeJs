"use strict";
module.exports = (sequelize, DataTypes) => {
  var City = sequelize.define(
    "city",
    {
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "city_id",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "city",
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "country_id",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "city",
    }
  );

  City.associate = function (models) {
    models.city.belongsTo(models.country, {
      foreignKey: "countryId",
      targetKey: "countryId",
    });

    models.city.hasMany(models.address, {
      foreignKey: "cityId",
      targetKey: "cityId",
    });
  };

  return City;
};
