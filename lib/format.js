'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.delimited = delimited;
exports.json = json;

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

// Format data types
function format(value) {
  return value instanceof Date ? value.getMonth() + 1 + '/' + value.getDate() + '/' + (1900 + value.getYear()) : value;
};

var DEFAULTS = {
  delimiter: ', '
};

// Format data as delimited string

function delimited(options) {
  options = _Object$assign({}, DEFAULTS, options);
  return _through22['default'].obj(function (data, env, next) {
    next(null, new Buffer(_Object$keys(data).map(function (k) {
      return format(data[k]);
    }).join(options.delimiter) + '\n'));
  });
}

// Format data as JSON string

function json(options) {
  options = _Object$assign({}, DEFAULTS, options);
  return _through22['default'].obj(function (data, env, next) {
    next(null, new Buffer(JSON.stringify(data) + '\n'));
  });
}