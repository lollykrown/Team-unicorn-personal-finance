const router = require("express").Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../../auth");
const incomeController = require('../controllers/incomeController')
const Category = require('./../models/category')
const debug = require('debug')('app:expenseController')

const { authMiddleware } = incomeController()

router.use(auth, authMiddleware)
router.post("/expenses", auth, expenseController.registerExpenseByDay);
router.get("/expenses", auth, expenseController.getDisplay);

// router.get("/expense",auth, expenseController.getExpenseByDay);

router.get("/total", auth, expenseController.getTotalExpenseForSpecifiedPeriod);

module.exports = router;