"use strict";

const Op = require("sequelize").Op;
const SqlString = require("sequelize/lib/sql-string");

module.exports = (sequelize, DataTypes) => {
  var Film = sequelize.define(
    "film",
    {
      filmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "film_id",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "title",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "description",
      },
      releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "release_year",
      },
      languageId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "language_id",
      },
      rentalDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "rental_duration",
      },
      rentalRate: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "rental_rate",
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "length",
      },
      replacementCost: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "replacement_cost",
      },
      rating: {
        type: DataTypes.ENUM("G", "PG", "PG-13", "R", "NC-17"),
        allowNull: true,
        field: "rating",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
      specialFeatures: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: "special_features",
      },
    },
    {
      tableName: "film",
    }
  );

  Film.associate = function (models) {
    models.film.belongsTo(models.language, {
      foreignKey: "languageId",
      targetKey: "languageId",
    });

    models.film.belongsToMany(models.category, {
      through: "filmCategory",
      foreignKey: "filmId",
      otherKey: "categoryId",
    });

    models.film.belongsToMany(models.actor, {
      through: "filmActor",
      foreignKey: "filmId",
      otherKey: "actorId",
    });

    models.film.addScope("titleMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            where: [
              sequelize.where(sequelize.col("title"), {
                [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
              }),
            ],
          };
    });

    models.film.addScope("descriptionMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            where: [
              sequelize.where(sequelize.col("description"), {
                [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
              }),
            ],
          };
    });

    models.film.addScope("ratingMatched", function (searchRating) {
      return searchRating == null || searchRating == ""
        ? {}
        : {
            where: [sequelize.where(sequelize.col("rating"), searchRating)],
          };
    });

    models.film.addScope("languageMatched", function (searchLanguageId) {
      return searchLanguageId == null || searchLanguageId == ""
        ? {}
        : {
            include: [{ model: models.language }],
            where: [
              sequelize.where(
                sequelize.col("language.language_id"),
                searchLanguageId
              ),
            ],
          };
    });

    models.film.addScope("categoryMatched", function (searchCategoryId) {
      return searchCategoryId == null || searchCategoryId == ""
        ? {}
        : {
            where: [
              {},
              sequelize.literal(
                `EXISTS(
              SELECT 1 FROM category JOIN film_category USING (category_id)
                  WHERE film_category.film_id = film.film_id
                  AND category.category_id = ${SqlString.escape(
                    searchCategoryId
                  )})`
              ),
            ],
          };
    });

    models.film.addScope("actorMatched", function (searchText) {
      if (searchText == null || searchText == "") {
        return {};
      }

      searchText = SqlString.escape(
        `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`
      );

      return {
        where: [
          {},
          sequelize.literal(
            `EXISTS(
              SELECT 1 FROM actor JOIN film_actor USING (actor_id)
                  WHERE film_actor.film_id = film.film_id
                  AND (
                    (actor.first_name ILIKE ${searchText})
                    OR (actor.last_name ILIKE ${searchText})
                  ))`
          ),
        ],
      };
    });
  };

  // Class Method
  Film.getDataTableFilms = async function (args) {
    const models = sequelize.models;
    const recordsTotal = Film.count();

    const scopeMap = {
      title: "titleMatched",
      categories: "categoryMatched",
      description: "descriptionMatched",
      actors: "actorMatched",
      rating: "ratingMatched",
      language: "languageMatched",
    };
    const filteredScopes = args.columns
      ? args.columns
          .filter((col) => {
            return (
              col.searchable &&
              col.search.value != null &&
              col.search.value != "" &&
              scopeMap[col.name]
            );
          })
          .map((col) => {
            return {
              method: [scopeMap[col.name], col.search.value],
            };
          })
      : null;

    const sortColMap = {
      title: "title",
      description: "description",
      length: "length",
      rating: sequelize.literal("rating::text"),
      //language: sequelize.col("language.name"),
      rental_rate: "rental_rate",
    };
    const orderBy = args.order
      ? args.order
          .map((ord) => {
            const col = args.columns[ord.column];
            return col.orderable && sortColMap[col.name]
              ? [
                  sortColMap[col.name],
                  ord.dir.toLowerCase() == "desc" ? "DESC" : "ASC",
                ]
              : null;
          })
          .filter((ord) => !!ord)
      : [];

    const recordsFiltered = Film.scope(filteredScopes).count({
      distinct: true,
      col: "film.film_id",
    });

    const dataFilteredPaging = Film.scope(filteredScopes).findAll({
      limit: args.length || 10,
      offset: args.start || 0,
      order: orderBy,
      include: [
        { model: models.language, required: true },
        {
          model: models.actor,
          through: {
            model: models.filmActor,
            attributes: [],
          },
        },
        {
          model: models.category,
          through: {
            model: models.filmCategory,
            attributes: [],
          },
        },
      ],
    });

    return Promise.all([
      recordsTotal,
      recordsFiltered,
      dataFilteredPaging,
    ]).then((responses) => {
      return {
        recordsTotal: responses[0],
        recordsFiltered: responses[1],
        data: responses[2],
      };
    });
  };

  return Film;
};
