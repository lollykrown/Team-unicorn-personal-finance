const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan') //logger
const mongoose = require('mongoose')
const debug = require('debug')('app')
const favicon = require('serve-favicon')
const cors = require("cors")
const chalk = require('chalk')
const cookieParser = require('cookie-parser')

process.env.NODE_ENV = 'production'

const app = express()
require('./config/config.js');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  //autoIndex: false, // Don't build indexes
}
mongoose.connect(global.gConfig.database_url, options)
.then(() => debug( 'Database Connected' ))
.catch(err => console.log( err ));

app.use(express.static(path.join(__dirname, '/public/')))
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.set('views', './views')
app.set('view engine', 'ejs')


app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.render('index')
})

app.use(function (req, res, next) {
  const cookie = req.cookies.token;
  if (!cookie) {
    debug('no cookie')
    //res.cookie('token', theJwtTokenValue, { maxAge: 900000, httpOnly: true });
  } else {
    req.headers["x-access-token"] = cookie
    req.headers["authorization"] = cookie
    debug('let\'s check that this is a valid cookie');
    // send cookie along to the validation functions...
    debug(chalk.blue(cookie))

  }
  next();
});

const authRouter = require('./src/routes/authRoutes')()
const incomeRouter = require('./src/routes/incomeRoutes')()
const budgetRouter = require('./src/routes/budgetRoutes')()
const expenseRouter = require("./src/routes/expenseRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");

app.use('/', authRouter)
app.use('/income', incomeRouter)
app.use('/budget', budgetRouter)
app.use(expenseRouter);
app.use(categoryRouter);

app.listen(process.env.PORT || global.gConfig.node_port, function () {
  debug(`${global.gConfig.app_name} Listening on port ${global.gConfig.node_port}...`)
})