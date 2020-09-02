const debug = require('debug')('app:incomeController')
const Income = require('../models/income')
const Budget = require('../models/budget')
const Expense = require("../models/expense")
const fs = require('fs')

function incomeController() {
  function authMiddleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      //res.send("Login first!");
      res.redirect('/signin');
    };
  }
  function postDailyIncome(req, res) {
    if (req.user) {
      (async function post() {
        try {
          const { amount, incomePeriod } = req.body
          debug(amount, incomePeriod)
          if (!amount || !incomePeriod) {
            res.status(400).send({
              status: false,
              message: 'All fields are required'
            })
            return
          }
          const inc = await Income.exists({ userId: req.user.id, incomePeriod })
          debug(inc)
          if (!inc) {
            debug('does not exists in db')
            const income = new Income({ userId: req.user.id, amount, incomePeriod })
            debug(income)
            const inco = await income.save()

            const incomePeriodStart = '2020-01-01'
            const incomePeriodEnd = '2020-12-31'
            let chart = await Income.find({ userId: req.user.id, incomePeriod: { $gte: incomePeriodStart, $lte: incomePeriodEnd } })
              .select('-_id incomePeriod amount').exec()

            const cha = await chart.toString()
            debug(cha)
            fs.writeFile('cha.json', cha, function (err) {
              if (err) throw err;
              debug('It\'s saved! in same location.');
            });

            res.status(200).redirect('/income')
            return
          }
          const newData = await Income.updateOne({ userId: req.user.id, incomePeriod }, { amount, incomePeriod }, { useFindAndModify: false, new: true })

          res.status(200).redirect('/income')
          debug('exists in db')
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  function postIncomeByMonth(req, res) {
    if (req.user) {
      (async function post() {
        try {
          const { amount, incomePeriod, incomeCategory } = req.body
          if (!amount || !incomePeriod || !incomeCategory) {
            res.status(400).send({
              status: false,
              message: 'All fields are required'
            })
            return
          }
          const inc = await Income.find({ userId: req.user.id, incomePeriod }).exec()
          debug(inc)
          if (inc.length < 1) {
            debug('does not exists in db')
            const income = new Income({ userId: req.user.id, incomeCategory, amount, incomePeriod })
            debug(income)
            const inco = await income.save()
            res.status(200).json(inco)
            return
          }
          const newData = await Income.findOneAndUpdate({ incomePeriod }, { amount, incomePeriod }, { useFindAndModify: false, new: true })
          res.status(200).json(newData)
          debug('exists in db')

        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  function getDailyIncomeByRange(req, res) {
    if (req.user) {
      (async function get() {
        try {
          const { incomePeriodStart, incomePeriodEnd, incomeCategory } = req.body
          if (!incomePeriod) {
            res.status(400).send({
              status: false,
              message: 'incomePeriod field is required'
            })
            return
          }
          let totalAmount = 0
          const inc = await Income.find({ userId: req.user.id, incomeCategory, incomePeriod: { $gte: incomePeriodStart, $lte: incomePeriodEnd } }).exec()
          debug(inc)
          for (let x of inc) {
            totalAmount += x.amount
          }
          debug(totalAmount)
          res.status(200).json({ totalAmount })

          debug(inc)
          res.status(200).json(inc)
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  function getDailyIncomeByRangeForCharts(req, res) {
    (async function get() {
      try {
        // const { incomePeriodStart } = req.body
        // if (!incomePeriod) {
        //   res.status(400).send({
        //     status: false,
        //     message: 'incomePeriod field is required'
        //   })
        //   return
        // }
        const incomePeriodStart = '2020-01-01'
        const incomePeriodEnd = '2020-12-31'
        //const inc = await Income.find({ userId: req.user.id, incomeCategory, incomePeriod: { $gte: incomePeriodStart, $lte: incomePeriodEnd } }).exec()
        const inc = await Income.find({ incomePeriod: { $gte: incomePeriodStart, $lte: incomePeriodEnd } })
        .select('-_id incomePeriod amount').exec()
        debug(inc)

        res.status(200).json({ inc })
      } catch (err) {
        debug(err.stack)
      }
    }());
  }
  function getIncomeByMonth(req, res) {
    if (req.user) {
      (async function get() {
        try {
          const { incomePeriod, incomeCategory } = req.body
          if (!incomePeriod) {
            res.status(400).send({
              status: false,
              message: 'incomePeriod field is required'
            })
            return
          }
          const inc = await Income.find({ userId: req.user.id, incomeCategory, incomePeriod }).exec()
          debug(inc)
          res.status(200).json(inc)
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  function getTotalIncomeForSpecifiedPeriod(req, res) {
    if (req.user) {
      (async function get() {
        try {
          // const { beginDate, endDate } = req.body
          // //Date format must be in this format "YYYY-MM-DD"
          // if (!beginDate, !endDate) {
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
          debug(inc)
          for (let x of inc) {
            totalAmount += x.amount
          }
          debug(totalAmount)
          res.status(200).json({ totalAmount })
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }

  return {
    authMiddleware,
    postDailyIncome,
    postIncomeByMonth,
    getDailyIncomeByRange,
    getDailyIncomeByRangeForCharts,
    getIncomeByMonth,
    getTotalIncomeForSpecifiedPeriod
  };
}

module.exports = incomeController