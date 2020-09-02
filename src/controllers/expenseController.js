const debug = require("debug")("app:expenseController");
const chalk = require("chalk");
const Expense = require("../models/expense")
const Category = require("../models/category")

exports.registerExpenseByDay = async (req, res, next) => {
    if (req.user) {
        try {
            const { categoryName, expensePeriod, expenseType, amount } = req.body;

            if (!categoryName || !expenseType || !amount || !expensePeriod) {
                return res.status(400)
                    .send({ status: false, message: 'All fields are required' })
            }

            const checkCategory = await Category.findOne({ userId: req.user.id, categoryName: categoryName })
            if (!checkCategory) {
                return res.status(404)
                    .send({ status: false, message: " Expense Category not found. Please save Category Type in settings " })
            }

            const checkExpense = await Expense.exists({userId: req.user.id, expenseType,category: categoryName,amount})
            if (checkExpense) {
                return res.status(403)
                    .send({ status: false, message: "Expense with exact details already exists" })
            }
            else {
                const newExpense = await new Expense({
                    userId: req.user.id,
                    expenseType: expenseType,
                    category: categoryName,
                    amount: amount,
                    expensePeriod
                })
                await newExpense.save();
                res.status(200).redirect('/expenses')
                    //.json({ status: true, message: "Expense details saved", data: newExpense })
            }
        }
        catch (error) { next(error) }
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}

exports.getExpenseByDay = async (req, res, next) => {
    if (req.user) {
        try {
            const { expensePeriod, expenseRange } = req.body;

            if (!expensePeriod) {
                return res.status(400)
                    .send({ status: false, message: "expensePeriod field required" })
            }

            const exp = await Expense.find({ userId: req.user.id, expensePeriod, expenseRange })
            if (!exp) {
                return res.status(400)
                    .send({ status: false, message: "data not found" })
            }
            else {
                return res.status(200)
                    .json({ status: true, data: exp })
            }
        }
        catch (error) { next(error) }
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}

exports.getTotalExpenseForSpecifiedPeriod = async (req, res, next) => {
    if (req.User) {
        try {
            const { beginDate, endDate } = req.body;

            if (!beginDate || !endDate) {
                return res.status(400)
                    .send({ status: false, message: "All fields are required" })
            }

            let totalExpenses = 0
            const exp = await Expense.find({ userId: req.user.id, expensePeriod: { $gte: beginDate, $lte: endDate } })

            if (!exp) {
                return res.status(400)
                    .send({ status: false, message: "data not found" })
            }
            else {
                for (let x of exp) {
                    totalExpenses += x.amount
                }
                return res.status(200)
                    .json({ totalExpenses })
            }
        }
        catch (error) { next(error) }
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}
exports.getDisplay = async (req, res) => {
    if (req.user) {
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
          const category = await Category.find({userId: req.user.id}).select('-_id -userId').exec()
          debug(category)
          res.status(200).render('expenses', { cat: category })
        } catch (err) {
          debug(err.stack)
        }
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }