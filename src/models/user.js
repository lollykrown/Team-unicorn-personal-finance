const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  email: {
    type: String,
    required: true
  },
	password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String
  },
  totalIncome: {
    type: Number,
  },
  totalExpenses: {
    type: Number
  },
  budget: {
    type: Number
  },
  savings: {
    type: Number
  }
})

usersSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next()
  }
})

usersSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ id: this._id, firstName: this.firstName, lastName: this.lastName, username: this.userName, 
    email: this.email, currency: this.currency }, 'personalFinanceTracker', { expiresIn: "2hr" })
  return token
}

module.exports = mongoose.model( 'User', usersSchema )