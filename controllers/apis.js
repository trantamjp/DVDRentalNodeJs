const path = require("path");

class APIController {
  extend(object) {
    object.routeName = path.basename(__filename);
    return Object.assign(this, object);
  }
}

module.exports = APIController;
