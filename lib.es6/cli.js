#!/usr/bin/env node

import cli from 'yargs';
import { FIELDS } from './const';
import fs from 'fs';
import merge from 'merge-stream';
import gr8 from './index';
import { delimited, json } from './format';
import combine from 'stream-combiner2';
import api from './api';

// Setup cli options
const argv = cli
        .usage('Usage: $0 [options] [file]')
        .describe('format', 'Format outputted results')
        .choices('format', ['json', 'delimited'])
        .nargs('format', 1)
        .example('$0 --format json foo.txt', 'Out files as JSON')
        .default('delimiter', ', ')
        .alias('delimiter', 'd')
        .nargs('delimiter', 1)
        .describe('delimiter', 'Specify delimiter for delimited format')
        .alias('sort', 's')
        .nargs('sort', 1)
        .describe('sort', 'Comma delimited list of field headers to sort by')
        .example('$0 -s DateOfBirth,-LastName', 'Sort fields ascending by DateOfBirth, then descending by LastName')
        .help('h')
        .alias('h', 'help')
        .default('f', FIELDS.join(','))
        .alias('f', 'fields')
        .nargs('f', 1)
        .describe('f', 'Comma delimited list of field headers to user')
        .example('$0  -f last,first,gender', 'Map parsed files to custom fields')
        .boolean('server')
        .describe('server', 'Create an API server')
        .default('port', 0)
        .nargs('port', 1)
        .alias('port', 'p')
        .describe('port', 'Port API server should listen to')
        .example('$0  --server --port 8080', 'Start an API server on port 8080')
        .argv;

// Create multiplex stream
let input = merge();

// Create a readable stream from each file
argv._.forEach(fp => input.add(fs.createReadStream(fp)));

// Read from stdin if it's not TTY
if (!process.stdin.isTTY) input.add(process.stdin);

const {
  format = !argv.server ? 'delimited' : undefined,
  fields,
  delimiter,
  sort,
  server,
  port
} = argv;

const fieldMap = fields.split(/[ ,]+/);

// Create gr8 stream instance
let stack = [
  gr8({
    format,
    fields: fieldMap,
    delimiter,
    sort: !sort ? false : sort.split(/[ ,]+/).map(name => {
      return name.indexOf('-') === 0
        ? [name.slice(1), false]
        : [name, true];
    })
  })
];

// Create API server
if (server) stack.push(api({ port, fields: fieldMap }));

// Send input to stream stack and pipe output to stdout
input
  .pipe(combine.obj(stack))
  .pipe(process.stdout);
