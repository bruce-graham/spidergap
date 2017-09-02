const deepClone = inputObj => {
  const valTypes = ['string', 'number', 'boolean', 'function', 'undefined'];
  let clonedObj = {};

  if (typeof inputObj !== 'object' || inputObj === null) {
    return 'Input for deepClone() was not an object';
  }

  const cloneValue = val => {
    let output = null;

    if (val === null) {
      return output;
    } else if (valTypes.includes(typeof val)) {
      output = val;
    } else if (Array.isArray(val)) {
      output = val.map( item => {
        return cloneValue(item);
      });
    } else {
      output = {};

      for (let key in val) {
        output[key] = cloneValue(val[key]);
      }
    }
    return output;
  };

  for (let key in inputObj) {
    clonedObj[key] = cloneValue(inputObj[key]);
  }

  return clonedObj;
};