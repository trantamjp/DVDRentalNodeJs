var express = require("express");
var router = express.Router();

const customerController = require("../controllers/apis/customer");
const filmController = require("../controllers/apis/film");
const categoryController = require("../controllers/apis/category");
const languageController = require("../controllers/apis/language");
const countryController = require("../controllers/apis/country");

router.get("/categories", categoryController.getCategories);
router.get("/languages", languageController.getLanguages);
router.get("/countries", countryController.getCountries);

router.post("/customers", customerController.getDataTableCustomers);
router.post("/films", filmController.getDataTableFilms);

module.exports = router;
