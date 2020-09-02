const express = require('express');
const authRouter = express.Router();
const userController = require('../controllers/userController');
const budgetController = require('../controllers/budgetController')
const auth = require('../../auth')

function router() {
  const { signUp, signIn, displayValuesAuth, addPreferredCurrency } = userController()
  const { displayValues } = budgetController()

  authRouter.route('/signup').post(signUp)
  .get((req, res) => {
    res.render('register');
  });
  authRouter.route('/signin').post(signIn)
  .get((req, res) => {
    res.render('login');
  });
  authRouter.route('/logout').get((req, res) => {
    res.redirect('/signin')
  })
  authRouter.route('/home').get(auth, displayValues)

  authRouter.route('/settings').post(auth, addPreferredCurrency).get(auth, (req, res) => {
    res.render('settings')
  })

  return authRouter;
}

module.exports = router;