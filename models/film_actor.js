"use strict";
module.exports = (sequelize, DataTypes) => {
  var FilmActor = sequelize.define(
    "filmActor",
    {
      actorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "actor_id",
      },
      filmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "film_id",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
    },
    {
      tableName: "film_actor",
    }
  );

  // FilmActor.associate = function (models) {
  //   models.filmActor.belongsTo(models.actor, {
  //     foreignKey: "actorId",
  //     targetKey: "actorId",
  //   });
  //   models.filmActor.belongsTo(models.film, {
  //     foreignKey: "filmId",
  //     targetKey: "filmId",
  //   });
  // };

  return FilmActor;
};
