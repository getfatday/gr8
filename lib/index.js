'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.sort = sort;
exports.map = map;

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _const = require('./const');

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _streamCombiner2 = require('stream-combiner2');

var _streamCombiner22 = _interopRequireDefault(_streamCombiner2);

var _format = require('./format');

var format = _interopRequireWildcard(_format);

var DEFAULTS = {
  fields: _const.FIELDS,
  parser: _parser2['default']
};

function sortBy(keys) {
  return function (a, b) {
    var stack = keys.slice();
    var key = undefined,
        direction = undefined;
    var sort = stack.shift();

    while (sort) {
      var _sort = sort;

      var _sort2 = _slicedToArray(_sort, 2);

      key = _sort2[0];
      direction = _sort2[1];

      if (a[key] < b[key]) return direction ? -1 : 1;
      if (a[key] > b[key]) return direction ? 1 : -1;
      sort = stack.shift();
    }
    return 0;
  };
};

// Sort input based on key

function sort() {
  var keys = arguments.length <= 0 || arguments[0] === undefined ? [[_const.FIELDS[0], true]] : arguments[0];

  var results = [];
  var sort = sortBy(keys);
  return _through22['default'].obj(function (data, env, next) {
    results.push(data);
    next();
  }, function (next) {
    var _this = this;

    results.sort(sort).forEach(function (data) {
      return _this.push(data);
    });
    next();
  });
}

// Parse input line as key / values pairs

function map(options) {
  options = _Object$assign({}, DEFAULTS, options);
  var parse = options.parser(options.fields);
  return _streamCombiner22['default'].obj(_eventStream2['default'].split(), _through22['default'].obj(function (line, env, next) {
    var l = line.trim();
    return l ? next(null, parse(l)) : next(null);
  }));
}

;

// Map and format input

exports['default'] = function (options) {
  options = _Object$assign({}, DEFAULTS, options);

  var stack = [map(options)];

  // Sort output
  if (options.sort) {
    stack.push(sort(options.sort));
  }

  // Add format to the stack if requested
  if (options.format && format[options.format]) {
    stack.push(format[options.format](options));
  }

  return _streamCombiner22['default'].obj(stack);
};

;