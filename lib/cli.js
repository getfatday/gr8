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

var _streamCombiner2 = require('stream-combiner2');

var _streamCombiner22 = _interopRequireDefault(_streamCombiner2);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

// Setup cli options
var argv = _yargs2['default'].usage('Usage: $0 [options] [file]').describe('format', 'Format outputted results').choices('format', ['json', 'delimited']).nargs('format', 1).example('$0 --format json foo.txt', 'Out files as JSON')['default']('delimiter', ', ').alias('delimiter', 'd').nargs('delimiter', 1).describe('delimiter', 'Specify delimiter for delimited format').alias('sort', 's').nargs('sort', 1).describe('sort', 'Comma delimited list of field headers to sort by').example('$0 -s DateOfBirth,-LastName', 'Sort fields ascending by DateOfBirth, then descending by LastName').help('h').alias('h', 'help')['default']('f', _const.FIELDS.join(',')).alias('f', 'fields').nargs('f', 1).describe('f', 'Comma delimited list of field headers to user').example('$0  -f last,first,gender', 'Map parsed files to custom fields').boolean('server').describe('server', 'Create an API server')['default']('port', 0).nargs('port', 1).alias('port', 'p').describe('port', 'Port API server should listen to').example('$0  --server --port 8080', 'Start an API server on port 8080').argv;

// Create multiplex stream
var input = (0, _mergeStream2['default'])();

// Create a readable stream from each file
argv._.forEach(function (fp) {
  return input.add(_fs2['default'].createReadStream(fp));
});

// Read from stdin if it's not TTY
if (!process.stdin.isTTY) input.add(process.stdin);

var _argv$format = argv.format;
var format = _argv$format === undefined ? !argv.server ? 'delimited' : undefined : _argv$format;
var fields = argv.fields;
var delimiter = argv.delimiter;
var sort = argv.sort;
var server = argv.server;
var port = argv.port;

var fieldMap = fields.split(/[ ,]+/);

// Create gr8 stream instance
var stack = [(0, _index2['default'])({
  format: format,
  fields: fieldMap,
  delimiter: delimiter,
  sort: !sort ? false : sort.split(/[ ,]+/).map(function (name) {
    return name.indexOf('-') === 0 ? [name.slice(1), false] : [name, true];
  })
})];

// Create API server
if (server) stack.push((0, _api2['default'])({ port: port, fields: fieldMap }));

// Send input to stream stack and pipe output to stdout
input.pipe(_streamCombiner22['default'].obj(stack)).pipe(process.stdout);