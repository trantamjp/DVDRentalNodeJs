const APIController = require("../apis");

const Controller = new APIController();

const models = require("../../models");

module.exports = Controller.extend({
  async getCategories(req, res) {
    models.category
      .findAll({
        order: [["name", "ASC"]],
      })
      .then(function (categories) {
        res.status(200).json(categories);
      });
  },
});
