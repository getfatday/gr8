import through from 'through2';
import { FIELDS } from './const';
import parser from './parser';
import es from 'event-stream';
import combine from 'stream-combiner2';
import * as format from './format';

const DEFAULTS = {
  fields: FIELDS,
  sort: false,
  parser
};

// Parse input line as key / values pairs.
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

  // Add format to the stack if requested
  if (options.format && format[options.format]) {
    stack.push(format[options.format](options));
  }

  return combine.obj(stack);
};
