var express = require('express');
var router = express.Router();
var kubeService = require('../service/kubeService');

/* GET users listing. */

var str1,str2;
// kubeService.getNodeInfo(str1, str2);
// console.log(str1)
router.get('/', function(req, res, next) {
	var myvar;
	kubeService.getNodeInfo(function(response){
	  myvar = response;
	  console.log(myvar);
	  res.render('kubeStatus',{string1: myvar});
	});
	//console.log(myvar);
});

module.exports = router;
