var express = require('express');
var mysql = require('mysql');
var zabbixService = require('../service/zabbixService');
var router = express.Router();

var dashboard_connection = mysql.createConnection({
  host: '10.58.81.152',
  user: 'root',
  password: 'Initial0'
})

router.get('/landscapes', function(req, res) {
  zabbixService.getLandscapes(function(data) {
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
})

router.get('/triggers/current', function(req, res) {
  zabbixService.getCurrentTriggerStatus(function(data) {
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
});

//?page=2&per_page=100
router.get('/triggers/all/:landscapeName', function(req, res) {
  var params = {
    landscape: req.params.landscapeName,
    page: req.query.page,
    per_page: req.query.per_page,
    history: req.query.history
  }
  zabbixService.getLandscapeTriggerStatus(params, function(data) {
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
});

router.post('/updateTrigger', function(req, res) {
  zabbixService.updateTrigger(req.body, function(data) {
    res.status(200).json(data);
  }, function(data) {
    res.status(500).json(data);
  });
});



module.exports = router;
