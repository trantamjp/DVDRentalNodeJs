const APIController = require("../apis");

const Controller = new APIController();
const models = require("../../models");

module.exports = Controller.extend({
  async getDataTableCustomers(req, res) {
    let args = req.is('application/json') ? req.body : {};

    args.start = args.start || 0;
    args.length = args.length || 10;

    models.customer.getDataTableCustomers(args).then(function (customers) {
      customers.draw = args.draw;
      res.status(200).json(customers);
    });
  },
});
