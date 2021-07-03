var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Knex = require('knex');
const knexConfig = require('./knexfile');

const { Model } = require('objection');
const { Person } = require('./models/Person');

// Initialize knex.
const knex = Knex(knexConfig.development);

// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex);

async function main() {
  // Delete all persons from the db.
  await Person.query().delete();

  // Insert one row to the database.
  await Person.query().insert({
    firstName: 'Jennifer',
    lastName: 'Aniston',
  });

  // Read all rows from the db.
  const people = await Person.query();

  console.log(people);
}

main()
  .then(() => knex.destroy())
  .catch((err) => {
    console.error(err);
    return knex.destroy();
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

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
