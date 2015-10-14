import through from 'through2';

// Format data types
function format(value) {
  return (value instanceof Date)
    ? `${value.getMonth()+1}/${value.getDate()}/${1900 + value.getYear()}`
    : value;
};

const DEFAULTS = {
  delimiter: ', '
};

// Format data as delimited string
export function delimited (options) {
  options = Object.assign({}, DEFAULTS, options);
  return through.obj(function (data, env, next) {
    next(null, new Buffer(Object.keys(data).map(k => format(data[k])).join(options.delimiter) + '\n'));
  });
}

// Format data as JSON string
export function json (options) {
  options = Object.assign({}, DEFAULTS, options);
  return through.obj(function (data, env, next) {
    next(null, new Buffer(JSON.stringify(data) + '\n'));
  });
}
