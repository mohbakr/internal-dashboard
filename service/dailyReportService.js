var Q = require('./q.js');
var myutil = require('./util');

var elasticsearchService = {
	"cn": "http://localhost:9200",
	"us": "https://search-sigma-qn46si4cn2cujpb77q67qldu3e.us-east-1.es.amazonaws.com",
	"eu": "https://search-sigma-qn46si4cn2cujpb77q67qldu3e.us-east-1.es.amazonaws.com",
	"msaus": "https://search-sigma-qn46si4cn2cujpb77q67qldu3e.us-east-1.es.amazonaws.com",

}

var daliyReportService = function() {};

daliyReportService.prototype.getHttpStatus = function(landscape ,duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-access-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-access-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-access-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-access-*/_search?size=0"
 	}
 	var queryBody = {
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": "NOT http_user_agent:jiankongbao AND NOT http_user_agent:\"http://www.pingdom.com/\"",
						"analyze_wildcard": true
              		}
          		},
				"filter": {
					"bool": {
						"must": [{
							"range": {
								"@timestamp": {
									"gte": startTime,
									"lte": endTime,
									"format": "epoch_millis"
								}
							}
						}],
						"must_not": []
					}
				}
			}
		},
		"size": 0,
		"aggs": {
			"2": {
				"terms": {
					"field": "Status.raw",
					"size": 0,
					"order": {
						"_term": "asc"
					}
				}
			}
		}
	}
	if (landscape == "msaus") {
		queryBody.aggs["2"].terms.field = "logmodule.redis.Status.raw"
	}

	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.aggregations && results.aggregations["2"]) {
			deferred.resolve({httpStatus: results.aggregations["2"].buckets});
		} else {
			deferred.resolve({httpStatus: []});
		}
	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getAccessLogCount = function(landscape, duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-access-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-access-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-access-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-access-*/_search?size=0"
 	}
 	var queryBody = {
		"aggs": {
		},
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"must": [
							{
								"range": {
									"@timestamp": {
										"format": "epoch_millis",
										"gte": startTime,
										"lte": endTime
									}
								}
							}
						],
						"must_not": []
					}
				},
				"query": {
					"query_string": {
						"analyze_wildcard": true,
						"query": "NOT http_user_agent:jiankongbao AND NOT  http_user_agent:\"http://www.pingdom.com/\""
					}
				}
			}
		},
		"size": 0
	}

	if (landscape == "msaus") {
		queryBody.aggs = {
    		"1": {
      			"cardinality": {
        			"field": "logmodule.redis.offset"
      			}
    		}
    	};
		queryBody.query.filtered.query.query_string.query = "NOT logmodule.redis.http_user_agent:jiankongbao AND NOT  logmodule.redis.http_user_agent:\"http://www.pingdom.com/\""
	}

	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.aggregations && results.aggregations["1"]) {
			deferred.resolve({"Access Log": results.aggregations["1"].value});
		} else if (results && results.hits) {
			deferred.resolve({"Access Log": results.hits.total});
		} else {
			deferred.resolve({"Access Log": null});
		}
	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getAppPV = function(landscape, duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-access-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-access-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-access-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-access-*/_search?size=0"
 	}
 	var queryBody = {
		"aggs": {},
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"must": [
							{
								"range": {
									"@timestamp": {
										"format": "epoch_millis",
										"gte": startTime,
										"lte": endTime
									}
								}
							}
						],
						"must_not": []
					}
				},
				"query": {
					"query_string": {
						"analyze_wildcard": true,
						"query": "http_host:\"\\\"app1-us.sapanywhere.com\\\"\" AND NOT http_user_agent:jiankongbao AND NOT http_user_agent:\"http://www.pingdom.com/\""
					}
				}
			}
		},
		"size": 0
	}

	if (landscape == "cn") {
		queryBody.query.filtered.query.query_string.query = "http_host:\"\\\"app1.sapanywhere.cn\\\"\" AND NOT http_user_agent:jiankongbao AND NOT http_user_agent:\"http://www.pingdom.com/\"";
	} else if (landscape == "us") {
		queryBody.query.filtered.query.query_string.query = "http_host:\"\\\"app1-us.sapanywhere.com\\\"\" AND NOT http_user_agent:jiankongbao AND NOT http_user_agent:\"http://www.pingdom.com/\"";
	} else if (landscape == "eu") {
		queryBody.query.filtered.query.query_string.query = "http_host:\"\\\"app1-eu.sapanywhere.com\\\"\" AND NOT http_user_agent:jiankongbao AND NOT http_user_agent:\"http://www.pingdom.com/\"";
	} else {
		queryBody.query.filtered.query.query_string.query = "logmodule.redis.http_host:\"\\\"go.sapanywhere.com\\\"\" AND NOT logmodule.redis.http_user_agent:jiankongbao AND NOT logmodule.redis.http_user_agent:\"http://www.pingdom.com/\" AND logmodule.redis.landscape:us";
		queryBody.aggs = {
    		"1": {
      			"cardinality": {
        			"field": "logmodule.redis.offset"
      			}
    		}
    	};
	}

	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.aggregations && results.aggregations["1"]) {
			deferred.resolve({"APP PV": results.aggregations["1"].value});
		} else if (results && results.hits) {
			deferred.resolve({"APP PV": results.hits.total});
		} else {
			deferred.resolve({"APP PV": null});
		}
	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getEshopPV = function(landscape, duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-access-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-access-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-access-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-access-*/_search?size=0"
 	}
 	var queryBody = {
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": "request_uri:\\\"cart\\\" AND request_method:\\\"GET\\\"",
						"analyze_wildcard": true
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"range": {
									"@timestamp": {
										"gte": startTime,
										"lte": endTime,
										"format": "epoch_millis"
									}
								}
							}
						],
						"must_not": []
					}
				}
			}
		},
		"size": 0,
		"aggs": {}
	}

	if (landscape == "msaus") {
		queryBody.query.filtered.query.query_string.query = "logmodule.redis.request_uri:\\\"cart\\\" AND logmodule.redis.request_method:\\\"Get\\\" AND logmodule.redis.landscape:us";
	}

	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.hits) {
			deferred.resolve({"ESHOP PV": results.hits.total});
		} else {
			deferred.resolve({"ESHOP PV": null});
		}
	},  function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getAppCount = function(landscape, duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-common-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-common-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-common-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-common-*/_search?size=0"
 	}
 	var queryBody = {
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": "type:app",
						"analyze_wildcard": true
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"range": {
									"@timestamp": {
										"gte": startTime,
										"lte": endTime,
										"format": "epoch_millis"
									}
								}
							}
						],
						"must_not": []
					}
				}
			}
		},
		"size": 0,
		"aggs": {}
	}

	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.hits) {
			deferred.resolve({"APP Log": results.hits.total});
		} else {
			deferred.resolve({"APP Log": null});
		}
	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getJobCount = function(landscape, duration) {
	var endTime = new Date().getTime();
	var deferred = Q.defer();
	var startTime;

	switch (duration) {
		case "24h": 
			startTime = endTime - 86400001;
			break;
		case "48h":
			startTime = endTime - 172800002;
			break;
		default:
			startTime = endTime - 86400001;
	}

	var indexUrlMapping = {
		"cn": elasticsearchService["cn"] + "/log-cn-common-*/_search?size=0",
		"us": elasticsearchService["us"] + "/log-us-common-*/_search?size=0",
		"eu": elasticsearchService["eu"] + "/log-eu-common-*/_search?size=0",
		"msaus": elasticsearchService["msaus"] + "/msa-us-common-*/_search?size=0"
 	}
 	var queryBody = {
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": "type:job",
						"analyze_wildcard": true
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"range": {
									"@timestamp": {
										"gte": startTime,
										"lte": endTime,
										"format": "epoch_millis"
									}
								}
							}
						],
						"must_not": []
					}
				}
			}
		},
		"size": 0,
		"aggs": {}
	}


	myutil.doPost(indexUrlMapping[landscape], queryBody, function (results) {
		if (results && results.hits) {
			deferred.resolve({"JOB Log": results.hits.total});
		} else {
			deferred.resolve({"JOB Log": null});
		}
	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise.nodeify();
}

// 错误无法通过 reject 传递给下个 promise 处理
daliyReportService.prototype.getLandscapeReport = function(landscape, duration) {
	var deferred = Q.defer();
	var promisesArr = []
	if (landscape == "msaus") {
		promisesArr = [this.getHttpStatus(landscape, duration), this.getAccessLogCount(landscape, duration), this.getAppPV(landscape, duration), this.getEshopPV(landscape, duration)]
	} else {
		promisesArr = [this.getHttpStatus(landscape, duration), this.getAccessLogCount(landscape, duration), this.getAppPV(landscape, duration), this.getEshopPV(landscape, duration), this.getAppCount(landscape, duration), this.getJobCount(landscape, duration)]
	}
	Q.all(promisesArr).then(function(results) {
		var data = {};
		results.forEach(function(item) {
			Object.assign(data, item);
		});
		deferred.resolve({"landscape": landscape, "data": data});
	}, function(errs) {
		console.log("get " + landscape + " daily report err");
		console.log(errs);
		var data = {};
		deferred.resolve({"landscape": landscape, "data": data});
	});

	return deferred.promise.nodeify();
}

daliyReportService.prototype.getDailyReport = function(duration, succ, fail) {
	Q.all([
		this.getLandscapeReport("cn", duration),
		this.getLandscapeReport("us", duration),
		this.getLandscapeReport("eu", duration),
		this.getLandscapeReport("msaus", duration)
	]).then(function(results) {
		console.log("success get getDailyReport");
		succ({status: "success", message: results});
	}, function(err) {
		console.log("get Daily report error");
		console.log(err);
		fail({status: "error", message: "get Daily report error"})
	});
}

module.exports = new daliyReportService();