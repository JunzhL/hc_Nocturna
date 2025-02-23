const validator = require('validator');

/**
 * Validates the incoming data for information-upload.
 * Example data:
 * {
 *   "partId": "12345",
 *   "vertices": [[10, 20], [30, 40]],
 *   "folds": [{"line": [[10, 20], [30, 40]], "angle": 90}],
 *   "extrusionDepth": 5
 * }
 */
function validateInformation(data) {
  const errors = [];

  // partId must be a non-empty string
  if (!data.partId || typeof data.partId !== 'string' || validator.isEmpty(data.partId.trim())) {
    errors.push('partId is required and must be a non-empty string');
  }

  // vertices must be an array of [x, y] pairs
  if (!Array.isArray(data.vertices)) {
    errors.push('vertices must be an array');
  } else {
    data.vertices.forEach((pair, index) => {
      if (!Array.isArray(pair) || pair.length !== 2) {
        errors.push(`vertices[${index}] must be an array of two numbers [x, y]`);
      } else {
        pair.forEach((num, i) => {
          if (typeof num !== 'number') {
            errors.push(`vertices[${index}][${i}] must be a number`);
          }
        });
      }
    });
  }

  // folds must be an array of objects { line: [[x1, y1], [x2, y2]], angle: number }
  if (!Array.isArray(data.folds)) {
    errors.push('folds must be an array');
  } else {
    data.folds.forEach((fold, idx) => {
      if (typeof fold !== 'object' || Array.isArray(fold)) {
        errors.push(`folds[${idx}] must be an object`);
      } else {
        if (!Array.isArray(fold.line) || fold.line.length !== 2) {
          errors.push(`folds[${idx}].line must be an array of two coordinate pairs`);
        } else {
          fold.line.forEach((coord, cIdx) => {
            if (!Array.isArray(coord) || coord.length !== 2) {
              errors.push(`folds[${idx}].line[${cIdx}] must be [x, y]`);
            } else {
              coord.forEach((num, nIdx) => {
                if (typeof num !== 'number') {
                  errors.push(`folds[${idx}].line[${cIdx}][${nIdx}] must be a number`);
                }
              });
            }
          });
        }
        if (typeof fold.angle !== 'number') {
          errors.push(`folds[${idx}].angle must be a number`);
        }
      }
    });
  }

  // extrusionDepth must be a number
  if (typeof data.extrusionDepth !== 'number') {
    errors.push('extrusionDepth must be a number');
  }

  return errors;
}

module.exports = validateInformation;
