var express = require('express');
var router = express.Router();
var kubeService = require('../service/kubeService');


// kubeService.getNodeInfo(str1, str2);
// console.log(str1)
router.get('/getdata', function(req, res) {
	kubeService.getNodeAddressInfo(function(data){
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
})

router.get('/test', function(req, res) {
	kubeService.getNodeAddressIno(function(data){
    res.status(200).json(data);
  }, function(data) {
    res.status(200).json(data);
  });
})

module.exports = router;