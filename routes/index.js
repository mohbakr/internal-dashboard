var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/zabbix/:landscapeName', function(req, res, next) {
  res.render("alertsHistory");
});

router.get('/report', function(req, res, next) {
  res.render("dailyReport");
});

router.get('/kubestatus', function(req, res, next) {
  res.render("kube/kubeStatus");
});

// router.get('/kubestatus', function(req, res, next) {
//   res.render("kubeStatus");
// });



module.exports = router;
