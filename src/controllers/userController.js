const debug = require('debug')('app:userController')
const bcrypt = require("bcryptjs")
const User = require('../models/user')
const Currency = require("../models/currency");
const chalk = require('chalk')

function userController() {
  function signUp(req, res) {
    (async function auth() {
      try {
        const { email, password, firstName, lastName, userName } = req.body
        if (!email || !password || !firstName || !lastName || !userName) {
          res.status(400).send({
            status: false,
            message: 'All fields are required'
          })
          return
        }
        const user = await User.findOne({ email }).exec();
        if (user) {
          return res.status(423)
            .send({ status: false, message: 'This email already exists' })
        }
        bcrypt.hash(password, 10)
          .then(password => {
            const user = new User({ email, password, firstName, lastName, userName });
            user.save()
              .then(docx => {
                debug(docx)
              });
          })
          .then(() => {
            res.status(200).render('login')
          })
          .catch(err => console.log(err));

      } catch (err) {
        console.log(err.stack)
      }
    }())
  }
  function signIn(req, res) {
    (async function auth() {
      try {
        const { email, password } = req.body
        debug(email, password)
        if (!email || !password ) {
          res.status(400).send({
            status: false,
            message: 'All fields are required'
          })
          return
        }
        const user = await User.findOne({ email }).exec()
        if (!user) {
          return res
            .status(404)
            .send("User not found, please provide valid credentials")
            // .render('login', {err: 'User not found, please provide valid credentials'})
        }

        bcrypt.compare(password, user.password).then(valid => {
          if (!valid) {
            return res.status(403).send("Incorrect username or password, please review details and try again");
          }
          const token = user.generateAuthToken();
          debug(token)

          res.cookie('token', token, { 
            httpOnly: true,
            // secure: true // - for secure, https only cookie
          });
        res.header("x-auth-token", token)
        //.send({
        //     status: true,
        //     id: user._id,
        //     password: user.category,
        //     message: 'You are now logged in'
          res.redirect('/settings');
        // })
      }).catch(err => debug(err));
      } catch (err) {
        debug(err.stack)
      }
    }())
  }
  function addPreferredCurrency(req, res) {
    if (req.user) {
      (async function get() {
        try {
          const { currency } = req.body
          const cur = await Currency.findOneAndUpdate({ userId: req.user.id }, { currency }, { useFindAndModify: false, new: true })
          if(!cur) {
            const curr = new Currency({ userId: req.user.id, currency })

            const curren = await curr.save()
            debug(curren)
          }
          
          res.status(200).render('settings', {message: 'currency added'})     
          //res.status(200).json({message: 'currency added'})      
        } catch (err) {
          debug(err.stack)
        }
      }());
    } else {
      res.status(401).send('Access denied. You are not logged in')
    }
  }
  return {
    signUp,
    signIn,
    addPreferredCurrency
  };
}

module.exports = userController