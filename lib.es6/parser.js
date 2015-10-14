import { FIELDS } from './const';

// Parse string as date
function parseDate(value) {
  const v = Date.parse(value);
  // Value is not a date
  if (isNaN(v)) return value;
  const d = new Date(v);
  // Offset to UTC
  return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
};


// Creates a parser that maps delimited strings to known field
// mappings
export default function parser(fields = FIELDS) {
  return line => {
    // Split line by known delimiters
    return line.split(/[ ,|]+/).reduce((obj, field, index) => {
      // Return map of fields and values
      return Object.assign({}, obj, {
        // Generate fields name when index out of bounds
        [fields[index] || `field_${index}`]: parseDate(field)
      });
    }, {});
  };
};
