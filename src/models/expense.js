const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    expenseType: { type: String, required: true, enum: ["cash","card"], lowercase: true, default: "card" },
    amount: { type: Number, required: true },
    expenseRange: { type: String, enum: ["Daily", "Monthly"], default: "Daily"},
    category: { type: String, required: true },
    expensePeriod: { type: Date}
});

module.exports = mongoose.model("Expense", expenseSchema);