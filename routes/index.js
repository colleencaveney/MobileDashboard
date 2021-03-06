var express = require('express');
var router = express.Router();
var licenseService = require('../service/licenseService.js');


function resultHandler(res, next) {
  return function (err, result) {
    if (err) return next(err);
    console.log(result);
    res.render('index', { title: 'Dashboard', data: result});
  }
}

router.get('/api/Dashboard', function(req, res, next) {
  licenseService.getLicenseData(req.dbs, req.query, function(err, result) {
    if (err) return next(err);
    res.send(result);
    }
  )
});

/* GET home page. */
router.get('/', function(req, res, next) {
  licenseService.getLicenseData(req.dbs, req.query, resultHandler(res, next));
});

router.get('/24HourLCount', function (req, res, next) {
  licenseService.getLicenseCount24Hours(req.dbs, req.query, resultHandler(res, next));
});
router.get('/top3AUsers', function (req, res, next) {
  licenseService.getTop3AccountUsers(req.dbs, req.query, resultHandler(res, next));
});
router.get('/top3EUsers', function (req, res, next) {
  licenseService.getTop3EvalUsers(req.dbs, req.query, resultHandler(res, next));
});
router.get('/AUserLCount', function (req, res, next) {
  licenseService.getAccountUserLicenseCount(req.dbs, req.query, resultHandler(res, next));
});
router.get('/EUserLCount', function (req, res, next) {
  licenseService.getEvalUserLicenseCount(req.dbs, req.query, resultHandler(res, next));
});
router.get('/UAUserLCount', function (req, res, next) {
  licenseService.getUniqueAccountUserLicenseCount(req.dbs, req.query, resultHandler(res, next));
});
router.get('/UEUserLCount', function (req, res, next) {
  licenseService.getUniqueEvalUserLicenseCount(req.dbs, req.query, resultHandler(res, next));
});



module.exports = router;
