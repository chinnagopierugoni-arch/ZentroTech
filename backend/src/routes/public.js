import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
import { resumeUpload } from '../middleware/upload.js';
import { validateBody } from '../middleware/validate.js';
import { applicationSchema, contactSchema, enquirySchema } from '../utils/schemas.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HttpError } from '../utils/http-error.js';
import { createStoragePath, removePrivateFile, signedAssetUrl, uploadPrivateFile } from '../utils/storage.js';

const router = Router();
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many submissions. Please try again later.' } }
});

function honeypot(req, res, next) {
  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    req.log?.warn({ route: req.path, reason: 'honeypot_filled' }, 'Submission was not persisted');
    return res.status(422).json({
      error: { code: 'submission_not_processed', message: 'Unable to verify this submission. Please review the form and try again.' }
    });
  }
  next();
}

function sanitizeDatabaseMessage(message) {
  return String(message || 'Supabase returned an unspecified error.')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
    .replace(/\b(?:sb_(?:secret|publishable)_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g, '[redacted-credential]')
    .replace(/\+?\d[\d\s().-]{6,}\d/g, '[redacted-number]')
    .replace(/\s+/g, ' ')
    .slice(0, 300);
}

function requireInsertedRecord(req, data, error, table, message) {
  if (!error && data && data.id !== undefined && data.id !== null) return data;

  req.log?.error({
    operation: 'insert',
    table,
    code: typeof error?.code === 'string' ? error.code : 'no_record_returned',
    httpStatus: Number.isInteger(error?.status) ? error.status : undefined,
    message: sanitizeDatabaseMessage(error?.message)
  }, 'Supabase insert failed');

  if (error?.code === '23505') throw new HttpError(409, 'This submission has already been received.', 'duplicate_submission');
  throw new HttpError(502, message, 'database_error');
}

router.post('/enquiries', writeLimiter, honeypot, validateBody(enquirySchema), asyncHandler(async (req, res) => {
  const form = req.validatedBody;
  const { data, error } = await supabase.from('project_enquiries').insert({
    full_name: form.name,
    email: form.email,
    phone: form.phone || null,
    company: form.company || null,
    service: form.service,
    budget: form.budget || null,
    message: form.message || form.description
  }).select('id, status, created_at').single();

  const record = requireInsertedRecord(req, data, error, 'project_enquiries', 'Unable to save your project enquiry.');
  res.status(201).json({ data: record });
}));

router.post('/contacts', writeLimiter, honeypot, validateBody(contactSchema), asyncHandler(async (req, res) => {
  const form = req.validatedBody;
  const { data, error } = await supabase.from('contact_messages').insert({
    full_name: form.name,
    email: form.email,
    subject: form.subject,
    message: form.message
  }).select('id, created_at').single();

  const record = requireInsertedRecord(req, data, error, 'contact_messages', 'Unable to save your contact message.');
  res.status(201).json({ data: record });
}));

router.get('/portfolio', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('portfolio_projects')
    .select('id, slug, name, type, description, category, accent, display_status, image_path, image_position, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new HttpError(502, 'Unable to load portfolio projects.', 'database_error');

  const projects = await Promise.all(data.map(async project => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    type: project.type,
    description: project.description,
    category: project.category,
    accent: project.accent,
    status: project.display_status,
    image: await signedAssetUrl('portfolio-images', project.image_path),
    imagePosition: project.image_position
  })));
  res.json({ data: projects });
}));

router.get('/products', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('products')
    .select('id, slug, name, category, description, features, image_path, sort_order, product_demos(id, title, description, video_path, video_url, thumbnail_path, is_published, sort_order)')
    .eq('is_active', true)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) throw new HttpError(502, 'Unable to load products.', 'database_error');

  const products = await Promise.all(data.map(async product => {
    const demos = await Promise.all((product.product_demos || [])
      .filter(demo => demo.is_published !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(async demo => ({
        id: demo.id,
        title: demo.title,
        description: demo.description,
        video: demo.video_url || await signedAssetUrl('product-videos', demo.video_path),
        thumbnail: await signedAssetUrl('product-images', demo.thumbnail_path)
      })));
    const firstDemo = demos[0];
    return {
      id: product.slug,
      databaseId: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features || [],
      image: await signedAssetUrl('product-images', product.image_path),
      video: firstDemo?.video || '',
      demos
    };
  }));
  res.json({ data: products });
}));

router.get('/jobs', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('job_openings')
    .select('id, slug, title, department, location, employment_type, description, requirements, sort_order')
    .eq('status', 'open')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new HttpError(502, 'Unable to load open positions.', 'database_error');
  res.json({ data });
}));

router.post('/job-applications', writeLimiter, resumeUpload, honeypot, validateBody(applicationSchema), asyncHandler(async (req, res) => {
  const form = req.validatedBody;
  let job = null;
  if (form.job_id) {
    const { data, error } = await supabase.from('job_openings').select('id, title')
      .eq('id', form.job_id).eq('status', 'open').eq('is_published', true).maybeSingle();
    if (error) throw new HttpError(502, 'Unable to verify the selected opening.', 'database_error');
    if (!data) throw new HttpError(400, 'This opening is no longer available.', 'job_unavailable');
    job = data;
  }

  const uploadId = randomUUID();
  let resumeStoragePath = null;
  if (req.file) {
    resumeStoragePath = createStoragePath(`applications/${uploadId}`, req.detectedFileType);
    await uploadPrivateFile('resumes', resumeStoragePath, req.file.buffer, req.detectedFileType.mime);
  }

  const application = {
    full_name: form.applicant_name,
    email: form.email,
    position: job?.title || form.role
  };
  if (form.phone) application.phone = form.phone;
  if (resumeStoragePath) application.resume_url = resumeStoragePath;

  const { data, error } = await supabase.from('career_applications').insert(application)
    .select('id, created_at').single();
  if (error) {
    if (resumeStoragePath) await removePrivateFile('resumes', resumeStoragePath);
  }
  const record = requireInsertedRecord(req, data, error, 'career_applications', 'Unable to save your application.');
  res.status(201).json({ data: record });
}));

export default router;
