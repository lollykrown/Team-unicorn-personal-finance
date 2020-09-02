const debug = require("debug")("app:categoryController");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const User = require("../models/user");
const Expense = require("../models/expense");
const Category = require("../models/category");


exports.addACategory = async (req, res, next) => {
    if (req.user) {
        try {
            const { categoryName } = req.body;

            if (!categoryName) {
                return res.status(400)
                    .send({ status: false, message: "Category field required" })
            }

            const category = await Category.findOne({userId: req.user.id, categoryName: categoryName }).exec()
            if (category) {
                return res.status(404)
                    .send({ status: false, message: "Category exists" })
            }
            else {
                const newCategory = await new Category({ categoryName: categoryName, userId: req.user.id })
                await newCategory.save();
                res.status(200).redirect('/settings')
                    //.json({ status: true, message: "Category Saved", data: newCategory })
            }
        }
        catch (error) { next(error) }
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}
exports.getAllUserCategories = async (req, res, next) => {
    if (req.user) {
        try {
            const allCats = await Category.find({userId: req.user.id}).select('-_id -userId').exec()
            res.status(200).redirect('/home')
                // .json({ status: true, message: "Categories:", data: allCats })
        }
        catch (error) { next(error) }
    }
    else {
        res.status(401)
            .send("Access denied. You are not logged in")
    }
}