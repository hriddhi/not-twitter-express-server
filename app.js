var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var cors = require('cors');

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

connect.then((db) => {
  console.log('Connected successfully to the server');
}, (err) => { console.log(err); });

const hostname = 'localhost';
const port = 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/homeRouter');
var profileRouter = require('./routes/profileRouter');
var signupRouter = require('./routes/signupRouter');
var loginRouter = require('./routes/loginRouter');
var postRouter = require('./routes/posts');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-12345-67890'));

/*app.use(session({
  name: 'session-id',
  secret: '12345-67890-12345-67890',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
})); */

app.use(passport.initialize());
//app.use(passport.session());

app.use('/signup', signupRouter);
app.use('/login', loginRouter);

app.use('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.setHeader('Content-type','text/plain');
    res.end('Successfully logged out');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

// app.use((req, res, next) => {

//   if(!req.session){
//     var err = new Error('You are not authenticated');
//     err.status = 403;
//     return next(err);
//   } else {
//     next();
//   }
// });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/home', homeRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); 

module.exports = app;