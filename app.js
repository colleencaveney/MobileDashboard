var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var data = require('./service/licenseService');

var app = express();

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
    
  });
}

function startServer(err, dbs) {
  if (err) {
    log.error("Initialization error:" + err);
    if (dbs.connection) dbs.connection.end();
    return;
  }
  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/data', data);

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

  app.listen(config.server.port);
  log.info("server started at " + config.server.port);

}


module.exports = app;
