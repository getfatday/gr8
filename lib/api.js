'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.application = application;
exports['default'] = api;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _const = require('./const');

var _ = require('./');

var DEFAULTS = {
  data: [],
  port: 0,
  fields: _const.FIELDS,
  verbose: true
};

function parseSort(keys) {
  return keys.split(/[ ,]+/).map(function (name) {
    return name.indexOf('-') === 0 ? [name.slice(1), false] : [name, true];
  });
};

// Application routes

function application(options) {
  options = _Object$assign({}, DEFAULTS, options);
  var _options = options;
  var data = _options.data;
  var fields = _options.fields;

  var app = (0, _express2['default'])();
  var records = data.slice();

  // External method to push new records
  app.push = function (record) {
    return records.push(record);
  };

  // Get all records
  app.get('/records', function (req, res) {
    return res.json({ records: records });
  });

  // Get all records sorted by a parameter
  app.get('/records/:sort', function (req, res) {
    var keys = parseSort(req.params.sort);
    var stream = (0, _.sort)(keys);
    var results = [];
    stream.pipe(_through22['default'].obj(function (data, enc, next) {
      results.push(data);
      next();
    }, function (next) {
      res.json({ records: results });
      next();
    }));
    records.forEach(function (record) {
      return stream.write(record);
    });
    stream.end();
  });

  // Post raw records
  app.post('/records', function (req, res) {
    var count = records.length;
    req.pipe((0, _.map)(options)).pipe(_through22['default'].obj(function (data, enc, next) {
      records.push(data);
      next(null, data);
    }, function (done) {
      done();
      res.json({ lastCount: count, count: records.length });
    }));
  });

  return app;
}

// Streaming API

function api(options) {
  options = _Object$assign({}, DEFAULTS, options);
  var _options2 = options;
  var port = _options2.port;
  var verbose = _options2.verbose;

  var app = application(options);
  // Start a server instance
  var server = app.listen(port, function () {
    if (verbose) console.log(JSON.stringify({ port: server.address().port, state: 'listening' }));
  });
  // Read input data and add to application records
  var stream = _through22['default'].obj(function (data, enc, next) {
    app.push(data);
    next();
  }, function (next) {
    server.on('close', function () {
      return next();
    });
  });
  stream.app = app;
  stream.server = server;
  return stream;
}

;