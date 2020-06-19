const APIController = require("../apis");

const Controller = new APIController();

const models = require("../../models");

module.exports = Controller.extend({
  async getLanguages(req, res) {
    models.language
      .findAll({
        order: [["name", "ASC"]],
      })
      .then(function (languages) {
        res.status(200).json(languages);
      });
  },
});
