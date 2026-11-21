import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { HttpError } from '../utils/http-error.js';
import { asyncHandler } from '../utils/async-handler.js';

const limits = {
  image: 8 * 1024 * 1024,
  video: 150 * 1024 * 1024,
  resume: 5 * 1024 * 1024
};

const memoryStorage = multer.memoryStorage();
const uploadLimitsFor = fileSize => ({
  storage: memoryStorage,
  limits: { fileSize, files: 1, fields: 30, parts: 35 }
});

const allowedTypes = {
  'portfolio-images': new Set(['image/jpeg', 'image/png', 'image/webp']),
  'product-images': new Set(['image/jpeg', 'image/png', 'image/webp']),
  'product-videos': new Set(['video/mp4', 'video/webm']),
  resumes: new Set(['application/pdf'])
};

async function validateFile(req, next, expectedBucket) {
  if (!req.file) throw new HttpError(400, 'A file is required.', 'file_required');
  const bucket = expectedBucket || req.params.bucket;
  const allowed = allowedTypes[bucket];
  if (!allowed) throw new HttpError(400, 'Unsupported storage bucket.', 'invalid_bucket');
  const sizeLimit = bucket === 'product-videos' ? limits.video : bucket === 'resumes' ? limits.resume : limits.image;
  if (req.file.size > sizeLimit) throw new HttpError(413, 'The uploaded file exceeds the size limit.', 'file_too_large');

  const detected = await fileTypeFromBuffer(req.file.buffer);
  if (!detected || !allowed.has(detected.mime)) {
    throw new HttpError(415, 'The uploaded file type is not allowed.', 'invalid_file_type');
  }
  req.detectedFileType = detected;
  req.storageBucket = bucket;
  next();
}

export const adminFileUpload = [
  (req, res, next) => {
    const bucketLimit = req.params.bucket === 'product-videos' ? limits.video : limits.image;
    multer(uploadLimitsFor(bucketLimit)).single('file')(req, res, next);
  },
  asyncHandler((req, res, next) => validateFile(req, next))
];

export const resumeUpload = [
  (req, res, next) => multer(uploadLimitsFor(limits.resume)).single('resume')(req, res, next),
  asyncHandler((req, res, next) => {
    if (!req.file) return next();
    return validateFile(req, next, 'resumes');
  })
];

export const uploadLimits = limits;
