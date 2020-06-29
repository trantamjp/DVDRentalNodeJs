var express = require("express");
var router = express.Router();


router.get("/home", function (req, res, next) {
  res.render("index", { title: "NodeJS Demo" });
});

router.get("/customers", function (req, res, next) {
  res.render("customers", { title: "Customers" });
});

router.get("/films", function (req, res, next) {
  res.render("films", { title: "Films" });
});

/* Redirect home page. */
router.get("/*", function (req, res, next) {
  res.redirect(req.protocol + '://' + req.hostname);
});

module.exports = router;
