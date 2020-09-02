const express = require('express')
const incomeRouter = express.Router()
const incomeController = require('../controllers/incomeController')
const auth = require('../../auth')
const debug = require('debug')

function router() {
  const { authMiddleware, postDailyIncome, postIncomeByMonth, getIncomeByMonth,
    getDailyIncomeByRange, getDailyIncomeByRangeForCharts, getTotalIncomeForSpecifiedPeriod } = incomeController()

  //incomeRouter.use(auth, authMiddleware)
  incomeRouter.route('/').get(auth, (req, res) => {
    res.render('income')
  })
  incomeRouter.route('/daily').post(auth, postDailyIncome).get(auth, getDailyIncomeByRange)
  incomeRouter.route('/monthly').post(auth, postIncomeByMonth).get(auth, getIncomeByMonth)
  incomeRouter.route('/total').get(auth, getTotalIncomeForSpecifiedPeriod)
  incomeRouter.route('/charts').get(getDailyIncomeByRangeForCharts)



  return incomeRouter;
}

module.exports = router;