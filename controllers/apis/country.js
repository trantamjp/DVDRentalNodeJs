const APIController = require("../apis");

const Controller = new APIController();

const models = require("../../models");

module.exports = Controller.extend({
  async getCountries(req, res) {
    models.country
      .findAll({
        order: [["country", "ASC"]],
      })
      .then(function (countries) {
        res.status(200).json(countries);
      });
  },
});
