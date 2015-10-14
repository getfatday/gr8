import express from 'express';
import through from 'through2';
import { FIELDS } from './const';
import { map, sort } from './';

const DEFAULTS = {
  data: [],
  port: 0,
  fields: FIELDS,
  verbose: true
};

function parseSort(keys) {
  return keys.split(/[ ,]+/).map(name => {
    return name.indexOf('-') === 0
      ? [name.slice(1), false]
      : [name, true];
  });
};

// Application routes
export function application (options) {
  options = Object.assign({}, DEFAULTS, options);
  const {data, fields} = options;
  let app = express();
  let records = data.slice();

  // External method to push new records
  app.push = record => records.push(record);

  // Get all records
  app.get('/records', (req, res) => res.json({records}));

  // Get all records sorted by a parameter
  app.get('/records/:sort', (req, res) => {
    const keys = parseSort(req.params.sort);
    let stream = sort(keys);
    let results = [];
    stream.pipe(through.obj(function (data, enc, next) {
      results.push(data);
      next();
    }, function (next) {
      res.json({records: results});
      next();
    }));
    records.forEach(record => stream.write(record));
    stream.end();
  });

  // Post raw records
  app.post('/records', (req, res) => {
    const count = records.length;
      req
      .pipe(map(options))
      .pipe(through.obj(function (data, enc, next) {
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
export default function api (options) {
  options = Object.assign({}, DEFAULTS, options);
  const {port, verbose} = options;
  let app = application(options);
  // Start a server instance
  let server = app.listen(port, () => {
    if (verbose) console.log(JSON.stringify({ port: server.address().port, state: 'listening' }));
  });
  // Read input data and add to application records
  let stream = through.obj(function (data, enc, next) {
    app.push(data);
    next();
  }, function (next) {
    server.on('close', () => next());
  });
  stream.app = app;
  stream.server = server;
  return stream;
};
