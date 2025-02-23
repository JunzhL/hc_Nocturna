const validateInformation = require('./information-validator');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // (context) => {
      //   const { data } = context;
      //   const errors = validateInformation(data);

      //   if (errors.length > 0) {
      //     // Combine all errors into one message
      //     throw new Error('Validation failed: ' + errors.join('; '));
      //   }

      //   // If valid, proceed
      //   return context;
      // }
    ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
