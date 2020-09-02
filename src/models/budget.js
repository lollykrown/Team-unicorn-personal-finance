const mongoose = require('mongoose')
const Schema = mongoose.Schema

const budgetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true,
  },
  periodRangeStart: {
    type: Date
  },
  periodRangeEnd: {
    type: Date
  }
})

module.exports = mongoose.model( 'Budget', budgetSchema )