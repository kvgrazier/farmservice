var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/FarmDB', { useNewUrlParser: true })
  .then(() =>  console.log('Mongoose FarmDB connection successful'))
  .catch((err) => console.error(err));

var apiRouter = require('./routes/farmrouter');
var app = express();
const port = 8080;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);

/* // catch 404 and forward to error handler
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
  res.send(err.status);
}); */
app.listen(port, () => console.log(`Farmservice listening on port ${port}!`));
//module.exports = app;