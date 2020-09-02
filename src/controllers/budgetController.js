const debug = require('debug')('app:budgetController')
const Budget = require('../models/budget')
const Expense = require("../models/expense")
const Income = require('../models/income')
const Currency = require("../models/currency");

function budgetController() {
  function postBudgetRange(req, res) {
    if (req.user) {
      (async function post() {
        try {
          const { amount, periodRangeStart, periodRangeEnd } = req.body
          if (!amount || !periodRangeStart || !periodRangeEnd) {
            res.status(400).send({
              status: false,
              message: 'All fields are required'
            })
            return
          }
          const exists = await Budget.exists({ userId: req.user.id, periodRangeStart, periodRangeEnd })
          debug(exists)
          if (exists) {
            res.status(200).json({message: 'You have already created budget for this period range'})
            return
          }
          const budget = new Budget({ userId: req.user.id, amount, periodRangeStart, periodRangeEnd })
          debug(budget)
          const bu = await budget.save()
          res.status(200).redirect('/budget')
         // res.status(200).json({message: 'success'}) 

        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }

  function getTotalBudgetForSpecifiedPeriod(req, res) {
    if (req.user) {
      (async function get() {
        try {
          const { periodRangeStart, periodRangeEnd } = req.body
          //Date format must be in this format "YYYY-MM-DD"
          // if (!periodRangeStart, !periodRangeEnd) {
          //   res.status(400).send({
          //     status: false,
          //     message: 'All fields are required'
          //   })
          //   return
          // }
          const budget = await Budget.findOne({ userId: req.user.id }).exec()
          debug(budget)
          res.status(200).render('budget', {budget})
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  function displayValues(req, res) {
    if (req.user) {
      (async function get() {
        try {
          const { periodRangeStart, periodRangeEnd } = req.body
          //Date format must be in this format "YYYY-MM-DD"
          // if (!periodRangeStart, !periodRangeEnd) {
          //   res.status(400).send({
          //     status: false,
          //     message: 'All fields are required'
          //   })
          //   return
          // }
          const beginDate = '2020-01-01'
          const endDate = '2020-12-31'
          let totalAmount = 0
          const inc = await Income.find({ userId: req.user.id, incomePeriod: { $gte: beginDate, $lte: endDate } }).exec()
          for (let x of inc) {
            totalAmount += x.amount
          }
          const incomePeriodStart = '2020-01-01'
          const incomePeriodEnd = '2020-12-31'
          const chart = await Income.find({ userId: req.user.id, incomePeriod: { $gte: incomePeriodStart, $lte: incomePeriodEnd } })
          .select('-_id incomePeriod amount').exec()
          debug(chart)

          const budget = await Budget.findOne({ userId: req.user.id }).sort({ periodRangeStart: -1 }).limit(1).exec() 
          const expense = await Expense.findOne({ userId: req.user.id }).sort({ expensePeriod: -1 }).limit(1).exec() 
          const income = await Income.findOne({ userId: req.user.id }).sort({ expensePeriod: -1 }).limit(1).exec() 
          debug(budget)
          const userCur = await Currency.findOne({userId: req.user.id}).select('-_id -userId').exec()
          // let inco = {}
          //   for(let x of income){
          //     inco = x[0]
          //   }

          debug(userCur)
          res.status(200).render('dashboard', { ch: chart, tot : totalAmount, cur: userCur.currency, exp: expense, bud: budget, inc: income, firstName: req.user.firstName, lastName: req.user.lastName})
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  return {
    postBudgetRange,
    getTotalBudgetForSpecifiedPeriod,
    displayValues
  };
}

module.exports = budgetController