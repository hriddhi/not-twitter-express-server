var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const hostname = 'localhost';
const port = 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/homeRouter');
var profileRouter = require('./routes/profileRouter');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/home', homeRouter);
app.use('/profile', profileRouter);

app.use(express.static(__dirname+'/public'));

app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','text/plain');
  res.end('This is the homepage');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
})

/*
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
*/