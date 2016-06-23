/**
 * Created by colleencaveney on 6/21/16.
 */
var express = require('express');
var app = express();

const config = require(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/acrossConf/mobileDashboard.js');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : config.datasource.host,
    user : config.datasource.user,
    password : config.datasource.password,
    port: config.datasource.port,
    database: config.datasource.database,
    connectionLimit: config.datasource.connectionLimit
});

connection.connect(function(err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// connection.query('SELECT lf.id, p.first_name, p.last_name FROM license_file lf, party p WHERE lf.party_id = p.id AND lf.created BETWEEN DATE_SUB(NOW(), INTERVAL \'00 24\' DAY_HOUR) AND NOW();', function (err, results, fields) {
//     if (err) throw err;
//     console.log('How many licenses generated in last 24 hours');
//     console.log(results);
// });
//
// connection.query('SELECT p.first_name, p.last_name, a.account_number, b.count FROM party p JOIN (SELECT party_id, account_id, COUNT(*) AS count FROM license_file WHERE account_id IS NOT NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) b ON p.id = b.party_id LEFT JOIN account a ON b.account_id = a.id;', function (err, results, fields) {
//     if(err) throw err;
//     licenses = results;
//     console.log('Top 3 account users who generated most license files');
//     console.log(results);
// });
//
// connection.query('SELECT p.first_name, p.last_name, a.count FROM party p JOIN (SELECT party_id, COUNT(*) AS count FROM license_file WHERE account_id IS NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) a ON p.id = a.party_id;', function (err, results, fields) {
//     if (err) throw err;
//     console.log('Top 3 eval users who generated most license files');
//     console.log(results);
// });
//
// connection.query('SELECT COUNT(DISTINCT(lf.party_id)) FROM license_file lf WHERE lf.account_id IS NULL;', function (err, results, fields) {
//     if (err) throw err;
//     console.log('How many licenses for unique users in eval');
//     console.log(results);
// });
//
// connection.query('SELECT COUNT(DISTINCT(lf.party_id)) FROM license_file lf WHERE lf.account_id IS NOT NULL;', function (err, results, fields) {
//     if (err) throw err;
//     console.log('How many licenses for unique account users');
//     console.log(results);
// });
//
// connection.query('SELECT lf.account_id, COUNT(*) FROM license_file lf WHERE lf.account_id IS NULL;', function (err, results, fields) {
//     if (err) throw err;
//     console.log('How many licenses generated by eval users');
//     console.log(results);
// });

var result;

connection.query('SELECT COUNT(lf.account_id) AS count FROM license_file lf WHERE lf.account_id IS NOT NULL;', function (err, results, fields) {
    if (err) throw err;
    result = results;
    console.log('How many licenses generated by account users');
    console.log(results);
});

app.get('/', function (req, res) {
    res.send('How many licenses generated by account users: ' + result[0].count);
});

var server = app.listen(8081, function() {
    console.log('Server started');
});