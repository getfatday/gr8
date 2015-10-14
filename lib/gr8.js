#!/usr/bin/env node
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _const = require('./const');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _format = require('./format');

var argv = _yargs2['default'].usage('Usage: $0 [options] [file]')['default']('format', 'delimited').describe('format', 'Format outputted results').choices('format', ['json', 'delimited']).nargs('format', 1).example('$0 --format json foo.txt', 'Out files as JSON')['default']('delimiter', ', ').alias('delimiter', 'd').nargs('delimiter', 1).describe('delimiter', 'Specify delimiter for delimited format').help('h').alias('h', 'help')['default']('f', _const.FIELDS.join(',')).alias('f', 'fields').nargs('f', 1).describe('f', 'Comma delimited list of field headers to user').example('$0  -f last,first,gender', 'Map parsed files to custom fields').argv;

var input = (0, _mergeStream2['default'])();

// Create a readable stream from each file
argv._.forEach(function (fp) {
  return input.add(_fs2['default'].createReadStream(fp));
});

// Read from stdin if it's not TTY
if (!process.stdin.isTTY) input.add(process.stdin);

var format = argv.format;
var fields = argv.fields;
var delimiter = argv.delimiter;

input.pipe((0, _index2['default'])({
  format: format,
  fields: fields.split(/[ ,]+/),
  delimiter: delimiter
})).pipe(process.stdout);