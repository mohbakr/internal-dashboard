var mysql = require('mysql');
var Q = require('./q.js');

var zabbixService = function() {};

var dashboard_connection = mysql.createConnection({
  host: '10.58.81.152',
  user: 'root',
  password: 'Initial0',
  database: 'dashboard'
});

var getAllLandscape = function() {
  var defer = Q.defer();
  dashboard_connection.query('select name from landscapes', function(err, results, fields) {
    if(!err) {
      console.log("select landscape success");
      defer.resolve(results);
    } else {
      console.log("select landscape name error");
      console.log(err);
      defer.reject({status: "error", message: "select landscape error"});
    }
  });
  return defer.promise;
}

zabbixService.prototype.getLandscapeTriggerStatus = function(params, succ, fail) {
  var sql = "select host_name, host_conn, trigger_name, trigger_severity, trigger_status, create_time from zabbix_alerts where landscape_name = ?";
  switch (params.history) {
    case "weekly":
      sql + " DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time)";
      break;
    case "montly":
      sql + " DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(create_time)";
      break;
    default:
      sql + " DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time)";
  }
  var getHistory = function(sql) {
    if(params.page && params.per_page) {
      sql += " limit " + (params.page - 1) * params.per_page + ", " + params.per_page;
    }
    var defer = Q.defer();
    dashboard_connection.query(sql, [params.landscape], function(err, results, fields) {
      if(!err) {
        defer.resolve({status: "success", message: results});
      } else {
        console.log("query history fail");
        defer.reject({status: "error", message: "query history fail"});
      }
    });
    return defer.promise;
  }
  getHistory(sql).then(succ, fail);
}

zabbixService.prototype.getCurrentTriggerStatus = function(succ, fail) {
  var getLandscapeTriggerInfo = function(landscape) {
    var defer = Q.defer();
    dashboard_connection.query("select host_name, host_conn, trigger_name, trigger_severity, trigger_status, create_time from zabbix_alerts where trigger_status = 'PROBLEM' and landscape_name = ?", [landscape], function(err, results, fields) {
      if(!err) {
        defer.resolve([landscape, results]);
      } else {
        defer.reject(err);
      }
    });
    return defer.promise;
  }
  var getPromiseList = function(landscapes) {
    var defer = Q.defer();
    var promiseList = [];
    for(var i = 0; i < landscapes.length; i++) {
      promiseList.push(getLandscapeTriggerInfo(landscapes[i].name));
      if(i == landscapes.length - 1) {
        defer.resolve(promiseList);
      }
    }
    return defer.promise;
  }
  var getAllInfo = function(promiseList) {
    var defer = Q.defer();
    Q.all(promiseList).spread(function() {
      allInfo = Array.from(arguments);
      var results = [];
      allInfo.forEach(function(info) {
        results.push({landscape: info[0], data: info[1]});
      });
      defer.resolve({ status: "success", message: results});
    });
    return defer.promise;
  }
  getAllLandscape().then(getPromiseList, fail).then(getAllInfo).then(succ).fail(fail);
}

zabbixService.prototype.updateTrigger = function(data, succ, fail) {
  console.log(data);
  var existTrigger = function(data) {
    var defer = Q.defer();
    let sql = "select landscape_name, event_id, trigger_name, trigger_status from zabbix_alerts where landscape_name = ? and event_id = ?";
    dashboard_connection.query(sql, [data.landscape, data.event_id], function(err, results, fields) {
      if (!err) {
        defer.resolve(results);
      } else {
        console.log("select zabbix alert status error");
        console.log(err);
        defer.reject({status: "error", message: "select zabbix alert status error"});
      }
    });
    return defer.promise;
  }
  var updateStatus = function(results) {
    var defer = Q.defer();
    if(results.length != 0) {
      if(results[0].trigger_status.toLowerCase() == "problem") {
        let update_query = "update zabbix_alerts set trigger_status = ? where landscape_name = ? and event_id = ?";
        dashboard_connection.query(update_query, [data.trigger_status, data.landscape, data.event_id], function(err, results, fields) {
          if(!err) {
            console.log("update zabbix alert status success");
            defer.resolve({status: "success", message: "update zabbix alert status success"});
          } else {
            console.log("update zabbix alert status error");
            console.log(err);
            defer.reject({status: "error", message: "update zabbix alert status error"});
          }
        });
      } else {
        defer.resolve({status: "success", message: "the records already existed"});
      }
    } else {
      console.log("db don't exeist the record");
      console.log(data.landscape);
      let insert_query = "insert into zabbix_alerts (landscape_name, host_name, host_conn, event_id, trigger_name, trigger_severity, trigger_status, create_time) values (?, ?, ?, ?, ?, ?, ?, ?)";
      dashboard_connection.query(insert_query, [data.landscape, data.host_name, data.host_conn, data.event_id, data.trigger_name, data.trigger_severity, data.trigger_status, data.event_time], function(err, results, fields) {
        if(!err) {
          console.log("insert new trigger success");
          defer.resolve({status: "success", message: "insert new trigger success"});
        } else {
          console.log("insert new trigger field");
          console.log(err);
          defer.reject({status: "error", message: "insert new trigger error"});
        }
      });
    }
    return defer.promise;
  }
  existTrigger(data).then(updateStatus, fail).then(succ, fail).catch(function(err) { console.log( err );});
};

zabbixService.prototype.getLandscapes = function(succ, fail) {
  var warpresult = function(data) {
    var defer = Q.defer();
    defer.resolve({status: "success", message: data});
    return defer.promise;
  }
  getAllLandscape().then(warpresult).then(succ, fail);
}

module.exports = new zabbixService();
