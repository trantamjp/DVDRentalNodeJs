var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/customers", function (req, res, next) {
  res.render("customers", { title: "Customers" });
});

router.get("/films", function (req, res, next) {
  res.render("films", { title: "Films" });
});

module.exports = router;
