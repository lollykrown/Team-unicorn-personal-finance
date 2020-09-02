const debug = require("debug")("app:categoryController");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const User = require("../models/user");
const Expense = require("../models/expense");
const Category = require("../models/category");
const Currency = require("../models/currency");


exports.addCurrency = async (req, res, next) => {
if (req.user) {
    (async function get() {
      try {
        const { currency } = req.body
        const cur = await Currency.findOneAndUpdate({ userId: req.user.id }, { currency }, { useFindAndModify: false, new: true })

        debug(cur)
        res.status(200).redirect('/home')
        //res.status(200).json({message: 'currency added'})
      } catch (err) {
        debug(err.stack)
      }
    }());
  } else {
    res.status(401).send('Access denied. You are not logged in')
  }
}
exports.getUserCurrency = async (req, res, next) => {
    if (req.user) {
        try {
            const userCur = await Currency.find({userId: req.user.id}).select('-_id -userId').exec()
            res.status(200).redirect('/home')
                // .json({ status: true, message: "Categories:", data: allCats })
        }
        catch (error) { next(error) };
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}