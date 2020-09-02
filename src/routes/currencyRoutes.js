const router = require("express").Router();
const currencyController = require("../controllers/currencyController");
const auth = require("../../auth");


router.post("/currency",auth, currencyController.addCurrency);
router.get("/currency",auth, currencyController.getUserCurrency);

module.exports = router;