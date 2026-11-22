import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { adminFileUpload } from '../middleware/upload.js';
import { parseQuery, validateBody } from '../middleware/validate.js';
import {
  applicationStatusSchema,
  demoSchema,
  enquiryStatusSchema,
  jobSchema,
  listQuerySchema,
  notificationQuerySchema,
  partialSchema,
  productSchema,
  projectSchema
} from '../utils/schemas.js';
import { asyncHandler } from '../utils/async-handler.js';
import { createStoragePath, signedAssetUrl, uploadPrivateFile } from '../utils/storage.js';
import { HttpError } from '../utils/http-error.js';

const router = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUuid(value) {
  if (!uuidPattern.test(value)) throw new HttpError(400, 'Invalid resource ID.', 'invalid_id');
}

function assertRecordId(value) {
  if (!/^\d+$/.test(value) && !uuidPattern.test(value)) {
    throw new HttpError(400, 'Invalid resource ID.', 'invalid_id');
  }
}

function registerCrudRoutes(path, table, schema) {
  const selectRows = asyncHandler(async (req, res) => {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw new HttpError(502, `Unable to load ${path}.`, 'database_error');
    res.json({ data, count });
  });

  router.get(`/${path}`, selectRows);
  router.post(`/${path}`, validateBody(schema), asyncHandler(async (req, res) => {
    const { data, error } = await supabase.from(table).insert(req.validatedBody).select('*').single();
    if (error) throw new HttpError(error.code === '23505' ? 409 : 502,
      error.code === '23505' ? 'A record with that slug already exists.' : `Unable to create ${path}.`,
      error.code === '23505' ? 'duplicate_record' : 'database_error');
    res.status(201).json({ data });
  }));
  router.patch(`/${path}/:id`, validateBody(partialSchema(schema)), asyncHandler(async (req, res) => {
    assertRecordId(req.params.id);
    const { data, error } = await supabase.from(table).update(req.validatedBody).eq('id', req.params.id).select('*').maybeSingle();
    if (error) throw new HttpError(error.code === '23505' ? 409 : 502, `Unable to update ${path}.`, 'database_error');
    if (!data) throw new HttpError(404, 'Record not found.', 'not_found');
    res.json({ data });
  }));
  router.delete(`/${path}/:id`, asyncHandler(async (req, res) => {
    assertRecordId(req.params.id);
    const { data, error } = await supabase.from(table).delete().eq('id', req.params.id).select('id').maybeSingle();
    if (error) throw new HttpError(502, `Unable to delete ${path}.`, 'database_error');
    if (!data) throw new HttpError(404, 'Record not found.', 'not_found');
    res.status(204).end();
  }));
}

router.get('/me', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('user_id, full_name, avatar_url')
    .eq('user_id', req.user.id).maybeSingle();
  if (error) throw new HttpError(502, 'Unable to load administrator profile.', 'database_error');
  res.json({ data: { user: { id: req.user.id, email: req.user.email }, admin: req.admin, profile: data } });
}));

router.get('/dashboard', asyncHandler(async (req, res) => {
  const count = async (table, column, value) => {
    let query = supabase.from(table).select('id', { count: 'exact', head: true });
    if (column === 'status[]') query = query.in('status', value);
    else if (column) query = query.eq(column, value);
    const result = await query;
    if (result.error) throw new HttpError(502, 'Unable to load dashboard statistics.', 'database_error');
    return result.count || 0;
  };
  const [totalEnquiries, newEnquiries, pendingEnquiries, completedProjects, totalPortfolioProjects, activeProducts, productDemos, jobApplications, recent] = await Promise.all([
    count('project_enquiries'),
    count('project_enquiries', 'status', 'new'),
    count('project_enquiries', 'status[]', ['pending', 'in_progress']),
    count('portfolio_projects', 'project_status', 'completed'),
    count('portfolio_projects'),
    count('products', 'is_active', true),
    count('product_demos', 'is_published', true),
    count('career_applications'),
    supabase.from('notifications').select('id, type, title, message, entity_type, entity_id, read_at, created_at')
      .order('created_at', { ascending: false }).limit(10)
  ]);
  if (recent.error) throw new HttpError(502, 'Unable to load recent notifications.', 'database_error');
  res.json({
    data: {
      totalEnquiries,
      newEnquiries,
      pendingEnquiries,
      completedProjects,
      totalPortfolioProjects,
      activeProducts,
      productDemos,
      jobApplications,
      recentNotifications: recent.data
    }
  });
}));

router.get('/enquiries', parseQuery(listQuerySchema), asyncHandler(async (req, res) => {
  const { page, page_size: pageSize, status, search } = req.validatedQuery;
  const from = (page - 1) * pageSize;
  let query = supabase.from('project_enquiries').select('*', { count: 'exact' })
    .order('created_at', { ascending: false }).range(from, from + pageSize - 1);
  if (status) query = query.eq('status', status);
  const term = search?.replace(/[^\p{L}\p{N}@+.\-\s]/gu, '').trim();
  if (term) query = query.or(['full_name', 'email', 'company', 'service', 'selected_product', 'selected_package', 'message'].map(key => `${key}.ilike.%${term}%`).join(','));
  const { data, error, count } = await query;
  if (error) throw new HttpError(502, 'Unable to load enquiries.', 'database_error');
  res.json({ data, page, pageSize, total: count || 0 });
}));

router.get('/enquiries/:id', asyncHandler(async (req, res) => {
  assertRecordId(req.params.id);
  const { data, error } = await supabase.from('project_enquiries').select('*').eq('id', req.params.id).maybeSingle();
  if (error) throw new HttpError(502, 'Unable to load enquiry details.', 'database_error');
  if (!data) throw new HttpError(404, 'Enquiry not found.', 'not_found');
  res.json({ data });
}));

router.patch('/enquiries/:id', validateBody(enquiryStatusSchema), asyncHandler(async (req, res) => {
  assertRecordId(req.params.id);
  const { data, error } = await supabase.from('project_enquiries').update(req.validatedBody)
    .eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw new HttpError(502, 'Unable to update enquiry.', 'database_error');
  if (!data) throw new HttpError(404, 'Enquiry not found.', 'not_found');
  res.json({ data });
}));

router.delete('/enquiries/:id', asyncHandler(async (req, res) => {
  assertRecordId(req.params.id);
  const { data, error } = await supabase.from('project_enquiries').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw new HttpError(502, 'Unable to delete enquiry.', 'database_error');
  if (!data) throw new HttpError(404, 'Enquiry not found.', 'not_found');
  res.status(204).end();
}));

router.get('/contacts', parseQuery(listQuerySchema), asyncHandler(async (req, res) => {
  const { page, page_size: pageSize, status, search } = req.validatedQuery;
  const from = (page - 1) * pageSize;
  let query = supabase.from('contact_messages').select('*', { count: 'exact' })
    .order('created_at', { ascending: false }).range(from, from + pageSize - 1);
  if (status) query = query.eq('status', status);
  const term = search?.replace(/[^\p{L}\p{N}@+.\-\s]/gu, '').trim();
  if (term) query = query.or(['full_name', 'email', 'subject', 'message'].map(key => `${key}.ilike.%${term}%`).join(','));
  const { data, error, count } = await query;
  if (error) throw new HttpError(502, 'Unable to load contact messages.', 'database_error');
  res.json({ data, page, pageSize, total: count || 0 });
}));

router.patch('/contacts/:id', validateBody(partialSchema(z.object({
  status: z.enum(['new', 'read', 'closed']),
  internal_notes: z.string().trim().max(10000).optional()
}))), asyncHandler(async (req, res) => {
  assertRecordId(req.params.id);
  const { data, error } = await supabase.from('contact_messages').update(req.validatedBody)
    .eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw new HttpError(502, 'Unable to update contact message.', 'database_error');
  if (!data) throw new HttpError(404, 'Contact message not found.', 'not_found');
  res.json({ data });
}));

router.get('/notifications', parseQuery(notificationQuerySchema), asyncHandler(async (req, res) => {
  const { page, page_size: pageSize, unread } = req.validatedQuery;
  let query = supabase.from('notifications').select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (unread === 'true') query = query.is('read_at', null);
  if (unread === 'false') query = query.not('read_at', 'is', null);
  const { data, error, count } = await query;
  if (error) throw new HttpError(502, 'Unable to load notifications.', 'database_error');
  res.json({ data, page, pageSize, total: count || 0 });
}));

router.patch('/notifications/:id/read', asyncHandler(async (req, res) => {
  assertUuid(req.params.id);
  const { data, error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() })
    .eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw new HttpError(502, 'Unable to update notification.', 'database_error');
  if (!data) throw new HttpError(404, 'Notification not found.', 'not_found');
  res.json({ data });
}));

registerCrudRoutes('portfolio-projects', 'portfolio_projects', projectSchema);
registerCrudRoutes('products', 'products', productSchema);
registerCrudRoutes('product-demos', 'product_demos', demoSchema);
registerCrudRoutes('job-openings', 'job_openings', jobSchema);

router.get('/job-applications', parseQuery(listQuerySchema), asyncHandler(async (req, res) => {
  const { page, page_size: pageSize, status, search } = req.validatedQuery;
  let query = supabase.from('career_applications').select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (status) query = query.eq('status', status);
  const term = search?.replace(/[^\p{L}\p{N}@+.\-\s]/gu, '').trim();
  if (term) query = query.or(['full_name', 'email', 'position'].map(key => `${key}.ilike.%${term}%`).join(','));
  const { data, error, count } = await query;
  if (error) throw new HttpError(502, 'Unable to load job applications.', 'database_error');
  res.json({ data, page, pageSize, total: count || 0 });
}));

router.patch('/job-applications/:id', validateBody(applicationStatusSchema), asyncHandler(async (req, res) => {
  assertRecordId(req.params.id);
  const { data, error } = await supabase.from('career_applications').update(req.validatedBody)
    .eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw new HttpError(502, 'Unable to update application.', 'database_error');
  if (!data) throw new HttpError(404, 'Application not found.', 'not_found');
  res.json({ data });
}));

router.get('/job-applications/:id/resume-url', asyncHandler(async (req, res) => {
  assertUuid(req.params.id);
  const { data, error } = await supabase.from('career_applications').select('resume_url')
    .eq('id', req.params.id).maybeSingle();
  if (error) throw new HttpError(502, 'Unable to load application resume.', 'database_error');
  if (!data?.resume_url) throw new HttpError(404, 'No resume is attached to this application.', 'resume_not_found');
  const url = /^https?:\/\//i.test(data.resume_url)
    ? data.resume_url
    : await signedAssetUrl('resumes', data.resume_url, 60);
  res.json({ data: { url, expiresIn: 60 } });
}));

router.post('/uploads/:bucket', adminFileUpload, asyncHandler(async (req, res) => {
  const bucket = req.storageBucket;
  const prefixByBucket = {
    'portfolio-images': 'portfolio',
    'product-images': 'products',
    'product-videos': 'product-demos'
  };
  if (!prefixByBucket[bucket]) throw new HttpError(400, 'Unsupported admin upload bucket.', 'invalid_bucket');
  const path = createStoragePath(prefixByBucket[bucket], req.detectedFileType);
  const storedPath = await uploadPrivateFile(bucket, path, req.file.buffer, req.detectedFileType.mime);
  res.status(201).json({ data: { bucket, path: storedPath, contentType: req.detectedFileType.mime, size: req.file.size } });
}));

export default router;
