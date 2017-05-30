var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var morgan = require('morgan');
var hbs = require('hbs');

var index = require('./routes/index');
var users = require('./routes/users');
var kubestatus = require('./routes/kubestatus');
var zabbix = require('./routes/zabbix');
var report = require('./routes/report');

var app = express();

// output logs
var accessLogStream = fs.createWriteStream(path.join(__dirname , 'logs/access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// import hbs, then extend block
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/v1/kubestatus', kubestatus);
app.use('/api/v1/zabbix', zabbix);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (app.get('env') === 'production') {
  app.listen(process.env.DASHBOARD_PORT || '3000', function () {
      console.log('Server is running!');
  });
} else {
  module.exports = app;
}
