import multer from 'multer';
import { HttpError } from '../utils/http-error.js';

export function notFound(req, res, next) {
  next(new HttpError(404, 'The requested API route was not found.', 'not_found'));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'invalid_json', message: 'Request body must be valid JSON.' } });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'payload_too_large', message: 'Request body exceeds the allowed size.' } });
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({
      error: { code: error.code.toLowerCase(), message: status === 413 ? 'The uploaded file exceeds the size limit.' : 'Invalid upload request.' }
    });
  }

  const known = error instanceof HttpError;
  const status = known ? error.status : 500;
  if (status >= 500) {
    req.log?.error({
      method: req.method,
      path: req.path,
      errorName: typeof error?.name === 'string' ? error.name : 'Error',
      errorCode: typeof error?.code === 'string' ? error.code : undefined
    }, 'API request failed');
  }

  return res.status(status).json({
    error: {
      code: known ? error.code : 'internal_error',
      message: known ? error.message : 'An unexpected error occurred.'
    }
  });
}
