import { fail } from '../utils/response.js';

export const validate = (validator) => (req, res, next) => {
  const errors = validator(req.body);
  if (Object.keys(errors).length) return fail(res, 400, 'Validation failed.', errors);
  next();
};
