const { feathersSchema } = require('feathers-schema');

/*
  Example of expected data:
  {
    "partId": "12345",
    "vertices": [[10, 20], [30, 40]],
    "folds": [
      {
        "line": [[10, 20], [30, 40]],
        "angle": 90
      }
    ],
    "extrusionDepth": 5
  }
*/

const informationUploadSchema = feathersSchema({
//   partId: {
//     type: String,
//     required: true,
//     sanitize: 'trim'   // Uses validator.js to remove surrounding whitespace
//   },

  vertices: {
    type: Array,
    required: true,
    // A custom validator to ensure vertices is an array of [x, y] numeric pairs
    custom: (value) => {
      if (!Array.isArray(value)) {
        throw new Error('vertices must be an array');
      }
      value.forEach(coord => {
        if (!Array.isArray(coord) || coord.length !== 2) {
          throw new Error('Each vertex must be an array of [x, y]');
        }
        coord.forEach(num => {
          if (typeof num !== 'number') {
            throw new Error('Coordinates in vertices must be numbers');
          }
        });
      });
    }
  },

  folds: {
    type: Array,
    required: true,
    // A custom validator to ensure folds is an array of objects
    custom: (value) => {
      if (!Array.isArray(value)) {
        throw new Error('folds must be an array');
      }
      value.forEach(fold => {
        // Must be an object with `line` and `angle`
        if (typeof fold !== 'object' || Array.isArray(fold)) {
          throw new Error('Each fold must be an object');
        }
        if (!fold.line || !Array.isArray(fold.line) || fold.line.length !== 2) {
          throw new Error('fold.line must be an array of two coordinate pairs');
        }
        fold.line.forEach(coord => {
          if (!Array.isArray(coord) || coord.length !== 2) {
            throw new Error('Each line coordinate must be an [x, y] array');
          }
          coord.forEach(num => {
            if (typeof num !== 'number') {
              throw new Error('Coordinates in fold.line must be numbers');
            }
          });
        });
        if (typeof fold.angle !== 'number') {
          throw new Error('fold.angle must be a number');
        }
      });
    }
  },

  extrusionDepth: {
    type: Number,
    required: true
    // If you need it to be an integer, you can add custom checks or
    // `validate: ['isInt']`, etc.
  }
});

module.exports = informationUploadSchema;
