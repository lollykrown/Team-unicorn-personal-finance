const mongoose = require('mongoose')
const Schema = mongoose.Schema

const incomeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
	incomeCategory: {
    type: String,
    lowercase: true,
    enum: ['daily', 'monthly', 'yearly'],
    default: 'daily'
  },
  incomeType: {
    type: String,
    enum: ['cash', 'card'],
    lowercase: true,
    default: 'card'
  },
  amount: {
    type: Number,
    required: true,
  },
  incomePeriod: {
    type: Date
  },
})

module.exports = mongoose.model( 'Income', incomeSchema )