/**
 * ── SIMPLE VALIDATION MIDDLEWARE ──
 * This utility checks if required fields are present in the request body
 * before reaching the controller.
 */

const validate = (requiredFields) => {
  return (req, res, next) => {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (errors.length > 0) {
      res.status(400);
      return next(new Error(errors.join(', ')));
    }

    next();
  };
};

module.exports = { validate };
