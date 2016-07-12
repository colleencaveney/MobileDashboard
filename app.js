
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var data = require('./service/licenseService');
//var jQuery = require('jquery');
//var bootstrap = require('bootstrap');



var mysql = require('mysql');
const config = require(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/acrossConf/mobileDashboard.js');

init(startServer);

// connect to database etc, dependencies before we can start the server
function init(cb) {
  // make sure we can connect to database
  var connection = mysql.createConnection({
    host : config.datasource.host,
    user : config.datasource.user,
    password : config.datasource.password,
    port: config.datasource.port,
    database: config.datasource.database,
    connectionLimit: config.datasource.connectionLimit
  });
  var dbs = {};
  connection.connect(function(err) {
    if (err) return cb(err, dbs);
    console.log("Database Connected");
    dbs.connection = connection;
    cb(null, dbs);
  });
}

var app = express();

function startServer(err, dbs) {
  console.log("start server");
  if (err) {
    if (dbs.connection) dbs.connection.end();
    return;
  }

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // Set no-cache
  app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
  });

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next) {
    req.dbs = dbs;
    next();
  });

  app.use('/', routes);
  //app.use('/data', data);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

}

module.exports = app;
