export const validateField = (value, options) => {
  const errors = [];

  if (options.required) {
    if (options.required.acceptZero) {
      if (!value && (value !== 0 || value !== '')) {
        return [options.required.message];
      }
    } else if (!value) {
      return [options.required.message];
    }
  }

  if (options.minLength && value && value.length < options.minLength.val) {
    errors.push(options.minLength.message);
  }

  if (options.maxLength && value && value.length > options.maxLength.val) {
    errors.push(options.maxLength.message);
  }

  if (options.pattern && value && !value.toString().match(options.pattern.val)) {
    errors.push(options.pattern.message);
  }

  if (options.equalValue && !(value === options.equalValue.val)) {
    errors.push(options.equalValue.message);
  }

  if (options.min && value < options.min.val) {
    errors.push(options.min.message);
  }

  if (options.max && value > options.max.val) {
    errors.push(options.max.message);
  }

  return errors.length > 0 ? errors : null;
};
