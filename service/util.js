var request = require('request');

var Util = function() {

};

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.getDateStr = function() {
    var dt = this;
    var year = dt.getFullYear() + '';
    var month = dt.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    var date = dt.getDate();
    date = date > 9 ? date : '0' + date;
    return year + '-' + month + '-' + date;
};

Util.prototype.getLocalDate = function(str){
    var dt = new Date(str);
    var year = dt.getFullYear() + '';
    var month = dt.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    var date = dt.getDate();
    date = date > 9 ? date : '0' + date;
    return year + '-' + month + '-' + date;
};

Date.prototype.DateAdd = function(strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};

//递减
Util.prototype.getLast7Days = function(date1) {
    var addDay = 24*60*60*1000;

    var date2 = formatDate(Date.parse(date1)-addDay),
        date3 = formatDate(Date.parse(date2)-addDay),
        date4 = formatDate(Date.parse(date3)-addDay),
        date5 = formatDate(Date.parse(date4)-addDay),
        date6 = formatDate(Date.parse(date5)-addDay),
        date7 = formatDate(Date.parse(date6)-addDay),
        date8 = formatDate(Date.parse(date7)-addDay);

    var  dates = [date1, date2, date3, date4, date5, date6, date7, date8];

    return dates;
};

Util.prototype.getLastMonth = function(date) {
    var dates1 = this.getLast7Days(date);
    var dates2 = this.getLast7Days(dates1[7]);
    var dates3 = this.getLast7Days(dates2[7]);
    var dates4 = this.getLast7Days(dates3[7]);
    var dates5 = this.getLast7Days(dates4[7]);
    var dates = [];
    for (var i = 0; i < 7; i++) {
        dates.push(dates1[i]);
    }
    for (var i = 0; i < 7; i++) {
        dates.push(dates2[i]);
    }
    for (var i = 0; i < 7; i++) {
        dates.push(dates3[i]);
    }
    for (var i = 0; i < 7; i++) {
        dates.push(dates4[i]);
    }
    for (var i = 0; i < 3; i++) {
        dates.push(dates5[i]);
    }
    return dates;
};

var isLeapYear = function(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
};

var getMonthDays = function (year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
};

Util.prototype.getWeekNumber = function(dt) {
    var now = dt,
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
    
    for (var i = 0; i < month; i++) {
        days += getMonthDays(year, i);
    }

    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    var week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / 7);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }

    return week;
};

//ms to date "yyyy.MM.dd"Date
var formatDate = function(time) {
    return new Date(time).Format("yyyy.MM.dd");
};

Util.prototype.base64Decode = function(str) {
    var c1, c2, c3, c4;
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    );
    var i = 0,
        len = str.length,
        string = '';

    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
        } while (
            i < len && c1 == -1
        );

        if (c1 == -1) break;

        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
        } while (
            i < len && c2 == -1
        );

        if (c2 == -1) break;

        string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return string;

            c3 = base64DecodeChars[c3]
        } while (
            i < len && c3 == -1
        );

        if (c3 == -1) break;

        string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return string;
            c4 = base64DecodeChars[c4]
        } while (
            i < len && c4 == -1
        );

        if (c4 == -1) break;

        string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return string;
};


//doPost
Util.prototype.doPost = function(url, body, succ, fail) {
    var opts = {
        url: url,
        body: JSON.stringify(body),
        method: "POST",
        rejectUnauthorized: false
    };

    doRequest(opts, succ, fail);
};

//doGet
Util.prototype.doGet = function(url, succ, fail) {
    var opts = {
        url: url,
        method: "GET",
        rejectUnauthorized: false
    };

    doRequest(opts, succ, fail);
};

Util.prototype.formatMoney = function(money, digit) {
    var tpMoney = '0.00';
    if(undefined != money) {
        tpMoney = money;
    }
    tpMoney = new Number(tpMoney);
    if(isNaN(tpMoney)) {
      return '0.00';
    }
    tpMoney = tpMoney.toFixed(digit) + '';
    var re = /^(-?\d+)(\d{3})(\.?\d*)/;
    while(re.test(tpMoney)) {
        tpMoney = tpMoney.replace(re, "$1,$2$3")
    }
                                   
    return tpMoney;
}

//doRequest
var doRequest = function(opts, succ, fail) {
    opts.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    request(opts, function(err, res, data) {
        if (err) {
            console.log("Error:" + err);
            fail(err);
        } else {
            try{
                succ(JSON.parse(data));
            } catch(e) {
                console.log("doRequest Options:" + JSON.stringify(opts));
                console.log("Error:" + e);
                console.log("Data:" + data);
            }
            
        }
    });
};

module.exports = new Util();