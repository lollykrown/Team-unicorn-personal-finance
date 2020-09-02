const jwt = require("jsonwebtoken")
const debug = require('debug')('app:auth')

module.exports = function(req, res, next) {
  if (!req.headers['x-access-token']) {
    return res.status(403).json({
      status: 403,
      message: 'FORBIDDEN'
    })
  }
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"]
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.")

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, "personalFinanceTracker")
    req.user = decoded
    debug(req.user);
    next()
  } catch (ex) {
    //if invalid token
    //res.status(400).send("Invalid or Expired token.")
    res.status(400).redirect('/signin')
  }
}