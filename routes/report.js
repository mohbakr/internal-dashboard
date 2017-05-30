var express = require('express');
var router = express.Router();
var dailyReportService = require('../service/dailyReportService')

router.get('/:range', function(req, res) {
  var range = req.params.range;
  dailyReportService.getDailyReport(range, function(data) {
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
});

module.exports = router;
