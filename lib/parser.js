'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = parser;

var _const = require('./const');

// Parse string as date
function parseDate(value) {
  var v = Date.parse(value);
  // Value is not a date
  if (isNaN(v)) return value;
  var d = new Date(v);
  // Offset to UTC
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
};

// Creates a parser that maps delimited strings to known field
// mappings

function parser() {
  var fields = arguments.length <= 0 || arguments[0] === undefined ? _const.FIELDS : arguments[0];

  return function (line) {
    // Split line by known delimiters
    return line.split(/[ ,|]+/).reduce(function (obj, field, index) {
      // Return map of fields and values
      return _Object$assign2({}, obj, _defineProperty({}, fields[index] || 'field_' + index, parseDate(field)));
    }, {});
  };
}

;
module.exports = exports['default'];

// Generate fields name when index out of bounds