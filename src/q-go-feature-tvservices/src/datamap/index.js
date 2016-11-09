import moment from 'moment';

export const types = ({
  number: (value) => Number(value),
  string: (value) => String(value),
  date: (value) => moment(value, 'YYYYMMDD'),
  epoch: (value) => moment.unix(value).utc(),
  object: (value) => value,
  bool: (value) => !!value,
});

export function to(field) {
  return {
    field,
    get optional() {
      this.isOptional = true;
      return this;
    },
    get required() {
      this.isOptional = false;
      return this;
    },
    get each() {
      this.isMultiMap = true;
      return this;
    },
    validate(validator) {
      if (!validator) {
        console.log('NULL VALIDATOR SPECIFIED IN .VALIDATE'); // eslint-disable-line
      }
      this.validator = validator;
      return this;
    },
    with(converter) {
      if (!converter) {
        console.log('NULL CONVERTER SPECIFIED IN .WITH'); // eslint-disable-line
      }
      this.converter = converter;
      return this;
    },
    get bool() {
      return this.with(types.bool);
    },
    get string() {
      return this.with(types.string);
    },
    get object() {
      return this.with(types.object);
    },
    get number() {
      return this.with(types.number);
    },
    get date() {
      return this.with(types.date);
    },
    get epoch() {
      return this.with(types.epoch);
    },
  };
}

export const ignore = ({
  field: null,
  isOptional: true,
});

export const required = ({
  field: null,
  isOptional: false,
});

export const create = (shape, literals) => ({
  get isDataAdapter() {
    return true;
  },
  shape: shape || {},
  literals: literals || {},
});

export const combine = (existing, extendWith) => {
  const l1 = existing.literals || {};
  const l2 = extendWith.literals || {};
  let literals;
  if (typeof l1 === 'function' || typeof l2 === 'function') {
    literals = (value) => Object.assign({},
      typeof l1 === 'function' ? l1(value) : l1,
      typeof l2 === 'function' ? l2(value) : l2
    );
  } else {
    literals = Object.assign({}, l1, l2);
  }
  return create(
    Object.assign({}, existing.shape, extendWith.shape),
    literals,
  );
};

export const using = (shape) => (data) => run(data, shape);

const formatdata = (data) => {
  const result = JSON.stringify(data);
  if (result.length > 20) {
    return `${result.substring(0, 20)} ...`;
  }
  return result;
};

const isDataAdapter = (value) => value && value.isDataAdapter;

const runConverter = (data, converter) => {
  if (!converter) {
    return data;
  }
  if (typeof converter === 'function') {
    const converted = converter(data);
    if (isDataAdapter(converted)) {
      return run(data, converted);
    }
    return converted;
  }
  if (isDataAdapter(converter)) {
    return run(data, converter);
  }
  console.log('Invalid Converter specified'); // eslint-disable-line
  return data;
};

export const run = (data, adapter) => {
  let result = {};
  const errors = [];
  const { shape, literals } = adapter;
  if (!isDataAdapter(adapter)) {
    errors.push('Invalid Adapter Provided');
    return null;
  }
  if (!data) {
    console.log('No Data Provided'); // eslint-disable-line
    return null;
  }
  if (!adapter) {
    console.log('No Adapter Provided'); // eslint-disable-line
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(item => run(item, adapter));
  }
  if (shape) {
    Object.keys(data).forEach(key => {
      if (!shape.hasOwnProperty(key)) { // eslint-disable-line
        // this means Data provided has something that we aren't expecting.
        // add it to bucket of extra info!
        errors.push(`Unexpected Property '${key}': ${formatdata(data[key])}`);
      }
    });
    Object.keys(shape).forEach(key => {
      if (!shape[key]) {
        errors.push(`Undefined map supplied as: ${key}`);
      } else {
        const { field, converter, validator, isOptional, isMultiMap } = shape[key];
        if (!data.hasOwnProperty(key)) { // eslint-disable-line
          if (!isOptional) {
            // this means that the data is missing something we ARE expecting.
            errors.push(`Expected Property '${key}' not found`);
          }
        } else {
          const value = data[key];
          if (field) {
            if (isMultiMap && Array.isArray(value)) {
              result[field] = value.map(item => {
                if (validator && !validator(item)) {
                  errors.push(`Unexpected Value for '${key}' : ${formatdata(data[key])}`);
                }
                return runConverter(item, converter);
              });
            } else {
              if (validator && !validator(value)) {
                errors.push(`Unexpected Value for '${key}' : ${formatdata(data[key])}`);
              }
              result[field] = runConverter(value, converter);
            }
          }
        }
      }
    });
  }
  if (literals) {
    if (typeof literals === 'function') {
      if (data) {
        result = Object.assign(result, literals(data));
      }
    } else {
      result = Object.assign(result, literals);
    }
  }
  if (errors.length > 0) {
    result._maperrors = errors; // eslint-disable-line
    // console.log('** Mapping Errors:'); // eslint-disable-line
    // console.log(data); // eslint-disable-line
    // console.log(adapter); // eslint-disable-line
    // errors.forEach(e => console.log(`*** ${e}`)); // eslint-disable-line
  }
  return result;
};
