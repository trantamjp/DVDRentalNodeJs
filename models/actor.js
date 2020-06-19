"use strict";
module.exports = (sequelize, DataTypes) => {
  var Actor = sequelize.define(
    "actor",
    {
      actorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "actor_id",
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "last_name",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "actor",
    }
  );

  Actor.associate = function (models) {
    models.actor.belongsToMany(models.film, {
      through: "filmActor",
      foreignKey: "actorId",
      otherKey: "filmId",
    });
  };

  return Actor;
};
