'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
  sort: false,
  parser: _parser2['default']
};

// Parse input line as key / values pairs.

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

  // Add format to the stack if requested
  if (options.format && format[options.format]) {
    stack.push(format[options.format](options));
  }

  return _streamCombiner22['default'].obj(stack);
};

;