const express = require('express')
const budgetRouter = express.Router()
const budgetController = require('../controllers/budgetController')
const auth = require('../../auth')
const incomeController = require('../controllers/incomeController')

function router() {
  const { postBudgetRange, getTotalBudgetForSpecifiedPeriod } = budgetController()
  const { authMiddleware } = incomeController()

  budgetRouter.use(auth, authMiddleware)

  budgetRouter.route('/').post(auth, postBudgetRange).get(auth, (req, res) => {
    res.render('budget')
  })

  budgetRouter.route('/total').get(auth, getTotalBudgetForSpecifiedPeriod)

  return budgetRouter;
}

module.exports = router;