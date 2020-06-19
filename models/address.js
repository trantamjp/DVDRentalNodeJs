"use strict";
module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define(
    "address",
    {
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "address_id",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "address",
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "address2",
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "district",
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "city_id",
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "postal_code",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "phone",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "address",
    }
  );

  Address.associate = function (models) {
    models.address.belongsTo(models.city, {
      foreignKey: "cityId",
      targetKey: "cityId",
    });
    models.address.hasMany(models.customer, {
      foreignKey: "addressId",
      targetKey: "addressId",
    });
  };

  return Address;
};
