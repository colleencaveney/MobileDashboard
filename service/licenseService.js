/**
 * Created by colleencaveney on 7/5/16.
 */
var async = require('async');
var top3AccountUsersSQL = "SELECT p.first_name, p.last_name, a.account_number, b.count FROM party p JOIN (SELECT party_id, account_id, COUNT(*) AS count FROM license_file WHERE account_id IS NOT NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) b ON p.id = b.party_id LEFT JOIN account a ON b.account_id = a.id";
var top3EvalUsersSQL = "SELECT p.first_name, p.last_name, a.count FROM party p JOIN (SELECT party_id, COUNT(*) AS count FROM license_file WHERE account_id IS NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) a ON p.id = a.party_id";
var uniqueEvalUserLicenseCountSQL = "SELECT COUNT(DISTINCT(lf.party_id)) AS count FROM license_file lf WHERE lf.account_id IS NULL";
var uniqueAccountUserLicenseCountSQL = "SELECT COUNT(DISTINCT(lf.party_id)) AS count FROM license_file lf WHERE lf.account_id IS NOT NULL";
var accountUserLicenseCountSQL = "SELECT COUNT(lf.account_id) AS count FROM license_file lf WHERE lf.account_id IS NOT NULL";
var evalUserLicenseCountSQL = "SELECT lf.account_id, COUNT(*) AS count FROM license_file lf WHERE lf.account_id IS NULL;";
var licenseCount24HoursSQL = "SELECT lf.id, p.first_name, p.last_name FROM license_file lf, party p WHERE lf.party_id = p.id AND lf.created BETWEEN DATE_SUB('2016-06-01 00:00:00', INTERVAL '00 24' DAY_HOUR) AND '2016-06-01 00:00:00'";


function getLicenseData(dbs, dataRange, cb) {
    async.series({
        'Top 3 Account Users': function (callback) {
            callback(null, getTop3AccountUsers(dbs, dataRange, cb));
        },
        'Top 3 Eval Users': function (callback) {
            callback(null, getTop3EvalUsers(dbs, dataRange, cb));
        },
        'Unique Account User License Count': function (callback) {
            callback(null, getUniqueAccountUserLicenseCount(dbs, dataRange, cb));
        },
        'Unique Eval User License Count': function (callback) {
            callback(null, getUniqueEvalUserLicenseCount(dbs, dataRange, cb));
        },
        'Account User License Count': function (callback) {
            callback(null, getAccountUserLicenseCount(dbs, dataRange, cb));
        },
        'Eval User License Count': function (callback) {
            callback(null, getEvalUserLicenseCount(dbs, dataRange, cb));
        },
        'Past 24 Hours License Count': function (callback) {
            callback(null, getLicenseCount24Hours(dbs, dataRange, cb));
        }
    }, function (err, results) {
        console.log(results);
    });
}

function getLicenseCount24Hours(dbs, dataRange, cb) {
    //log.debug("licenseService.js - getLicenseData()");

    dbs.connection.query(licenseCount24HoursSQL,[dataRange], function (err, rows) {
            if (err) return cb(err);
            var jsondata = [];
            for(i = 0; i < rows.length; i++){
                jsondata.push({id:rows[i].id, first_name:rows[i].first_name, last_name:rows[i].last_name});
            }

            //log.debug("licenseService.js - getLicenseData() finished " + jsondata);
            cb(null, jsondata);
        }
    );
}

function getTop3AccountUsers(dbs, dataRange, cb) {
   // log.debug("licenseService.js - getLicenseData()");

    dbs.connection.query(top3AccountUsersSQL,[dataRange], function (err, rows) {
            if (err) return cb(err);
            var jsondata = [];
            for(i = 0; i < rows.length; i++){
                jsondata.push({first_name:rows[i].first_name, last_name:rows[i].last_name, account_number:rows[i].account_number, count:rows[i].count});
            }

           // log.debug("licenseService.js - getLicenseData() finished " + jsondata);
            cb(null, jsondata);
        }
    );
}

function getTop3EvalUsers(dbs, dataRange, cb) {
   // log.debug("licenseService.js - getLicenseData()");
    
    dbs.connection.query(top3EvalUsersSQL, [dataRange], function (err, rows) {
        if (err) return cb(err);
        var jsondata = [];
        for(i = 0; i<rows.length; i++){
            jsondata.push({first_name:rows[i].first_name, last_name:rows[i].last_name, account_number:rows[i].account_number, count:rows[i].count});
        }
        
        //log.debug("licenseService.js - getLicenseData()");
        cb(null, jsondata);
        }
    );
}

function getAccountUserLicenseCount(dbs, dataRange, cb) {
   // log.debug("licenseService.js - getLicenseData()");

    dbs.connection.query(accountUserLicenseCountSQL, [dataRange], function(err, rows) {
            if (err) return cb(err);
            var jsondata = [];
            jsondata.push(count = rows[0].count);
           // log.debug("licenseService.js - getLicenseData()");
            cb(null, jsondata);
        }
    );
}

function getEvalUserLicenseCount(dbs, dataRange, cb) {
    //log.debug("licenseService.js - getLicenseData()");

    dbs.connection.query(evalUserLicenseCountSQL, [dataRange], function(err, rows) {
            if (err) return cb(err);
            var jsondata = [];
            jsondata.push(count = rows[0].count);
           // log.debug("licenseService.js - getLicenseData()");
            cb(null, jsondata);
        }
    );
}

function getUniqueAccountUserLicenseCount(dbs, dataRange, cb) {
    //log.debug("licenseService.js - getLicenseData()");

    dbs.connection.query(uniqueAccountUserLicenseCountSQL, [dataRange], function(err, rows) {
            if (err) return cb(err);
            var jsondata = [];
            jsondata.push(count = rows[0].count);
            //log.debug("licenseService.js - getLicenseData()");
            cb(null, jsondata);
        }
    );
}

function getUniqueEvalUserLicenseCount(dbs, dataRange, cb) {
    //log.debug("licenseService.js - getLicenseData()");
    
    dbs.connection.query(uniqueEvalUserLicenseCountSQL, [dataRange], function(err, rows) {
        if (err) return cb(err);
        var jsondata = [];
        jsondata.push(count = rows[0].count);
        //log.debug("licenseService.js - getLicenseData()");
        cb(null, jsondata);
        }
    );
}

exports.getLicenseCount24Hours = getLicenseCount24Hours;
exports.getTop3AccountUsers = getTop3AccountUsers;
exports.getTop3EvalUsers = getTop3EvalUsers;
exports.getAccountUserLicenseCount = getAccountUserLicenseCount;
exports.getEvalUserLicenseCount = getEvalUserLicenseCount;
exports.getUniqueAccountUserLicenseCount = getUniqueAccountUserLicenseCount;
exports.getUniqueEvalUserLicenseCount = getUniqueEvalUserLicenseCount;
exports.getLicenseData = getLicenseData;
