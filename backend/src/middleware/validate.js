import { HttpError } from '../utils/http-error.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new HttpError(400, 'Please check the submitted information.', 'validation_error'));
    }
    req.validatedBody = result.data;
    return next();
  };
}

export function parseQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new HttpError(400, 'Invalid query parameters.', 'validation_error'));
    }
    req.validatedQuery = result.data;
    return next();
  };
}
