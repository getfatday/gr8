import through from 'through2';
import { FIELDS } from './const';
import parser from './parser';
import es from 'event-stream';
import combine from 'stream-combiner2';
import * as format from './format';

const DEFAULTS = {
  fields: FIELDS,
  parser
};

// Returns a sort function based on an array of [key, direction]
// pairs. Setting the direction to true will sort in ascending order
// and descending order for false.
function sortBy(keys) {
  return (a, b) => {
    let stack = keys.slice();
    let key, direction;
    let sort = stack.shift();

    while(sort) {
      [key, direction] = sort;
      if (a[key] < b[key]) return direction ? -1 : 1;
      if (a[key] > b[key]) return direction ? 1 : -1;
      sort = stack.shift();
    }
    return 0;
  };
};

// Sort input based on key
export function sort(keys = [[FIELDS[0], true]]) {
  let results = [];
  let sort = sortBy(keys);
  return through.obj(function (data, env, next) {
    results.push(data);
    next();
  }, function (next) {
    results.sort(sort).forEach(data => this.push(data));
    next();
  });
}

// Parse input line as key / values pairs
export function map(options) {
  options = Object.assign({}, DEFAULTS, options);
  const parse = options.parser(options.fields);
  return combine.obj(
    es.split(),
    through.obj(function (line, env, next) {
      const l = line.trim();
      return (l)
        ? next(null, parse(l))
        : next(null);
    })
  );
};

// Map and format input
export default function (options) {
  options = Object.assign({}, DEFAULTS, options);

  let stack = [
    map(options)
  ];

  // Sort output
  if (options.sort) {
    stack.push(sort(options.sort));
  }

  // Add format to the stack if requested
  if (options.format && format[options.format]) {
    stack.push(format[options.format](options));
  }

  return combine.obj(stack);
};
