"use strict";

const Op = require("sequelize").Op;

module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define(
    "customer",
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "customer_id",
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "store_id",
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "email",
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "address_id",
      },
      activeBool: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "activebool",
      },
      createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "create_date",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: "last_update",
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "active",
      },
    },
    {
      tableName: "customer",
    }
  );

  Customer.associate = function (models) {
    models.customer.belongsTo(models.address, {
      foreignKey: "addressId",
      targetKey: "addressId",
    });

    models.customer.addScope("firstNameMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            where: [
              {
                first_name: {
                  [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
                },
              },
            ],
          };
    });

    models.customer.addScope("lastNameMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            where: [
              {
                last_name: {
                  [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
                },
              },
            ],
          };
    });
    models.customer.addScope("addressMatched", function (searchText) {
      if (searchText == null || searchText == "") {
        return {};
      }

      searchText = `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`;

      return {
        include: [{ model: models.address }],
        where: [
          {
            [Op.or]: [
              sequelize.where(sequelize.col("address.address"), {
                [Op.iLike]: searchText,
              }),
              sequelize.where(sequelize.col("address.address2"), {
                [Op.iLike]: searchText,
              }),
            ],
          },
        ],
      };
    });

    models.customer.addScope("cityMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            include: [
              {
                model: models.address,
                include: [{ model: models.city }],
              },
            ],
            where: [
              sequelize.where(sequelize.col("address.city.city"), {
                [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
              }),
            ],
          };
    });

    models.customer.addScope("postalCodeMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            include: [{ model: models.address }],
            where: [
              sequelize.where(sequelize.col("address.postal_code"), {
                [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
              }),
            ],
          };
    });

    models.customer.addScope("countryMatched", function (searchCountryId) {
      return searchCountryId == null || searchCountryId == ""
        ? {}
        : {
            include: [
              {
                model: models.address,
                include: [
                  { model: models.city, include: [{ model: models.country }] },
                ],
              },
            ],
            where: [
              sequelize.where(
                sequelize.col("address.city.country.country_id"),
                searchCountryId
              ),
            ],
          };
    });

    models.customer.addScope("phoneMatched", function (searchText) {
      return searchText == null || searchText == ""
        ? {}
        : {
            include: [{ model: models.address }],
            where: [
              sequelize.where(sequelize.col("address.phone"), {
                [Op.iLike]: `%${searchText.replace(/(_|%|\\)/g, "\\$1")}%`,
              }),
            ],
          };
    });

    models.customer.addScope("activeBoolMatched", function (activebool) {
      return activebool == null || activebool == ""
        ? {}
        : {
            where: [{ activebool: activebool == 1 }],
          };
    });
  };

  // Class Method
  Customer.getDataTableCustomers = async function (args) {
    const models = sequelize.models;
    const recordsTotal = Customer.count();

    const scopeMap = {
      firstName: "firstNameMatched",
      lastName: "lastNameMatched",
      address: "addressMatched",
      city: "cityMatched",
      postalCode: "postalCodeMatched",
      country: "countryMatched",
      phone: "phoneMatched",
      activeBool: "activeBoolMatched",
    };
    const filteredScopes = args.columns
      ? args.columns
          .filter((col) => {
            return (
              col.searchable && col.search.value != "" && scopeMap[col.name]
            );
          })
          .map((col) => {
            return {
              method: [scopeMap[col.name], col.search.value],
            };
          })
      : null;

    const sortColMap = {
      firstName: sequelize.col("first_name"),
      lastName: sequelize.col("last_name"),
      address: sequelize.col("address.address"),
      city: sequelize.col("address.city.city"),
      postalCode: sequelize.col("address.postal_code"),
      country: sequelize.col("address.city.country.country"),
      phone: sequelize.col("address.phone"),
      activeBool: sequelize.col("activebool"),
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

    const recordsFiltered = Customer.scope(filteredScopes).count({
      distinct: true,
      col: "customer.customer_id",
    });

    const dataFilteredPaging = Customer.scope(filteredScopes).findAll({
      limit: args.length || 10,
      offset: args.start || 0,
      order: orderBy,
      include: [
        {
          model: models.address,
          include: [
            {
              model: models.city,
              include: [
                {
                  model: models.country,
                },
              ],
            },
          ],
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

  return Customer;
};
