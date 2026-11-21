import { z } from 'zod';

const email = z.string().trim().email().max(254).transform(value => value.toLowerCase());
const optionalText = max => z.string().trim().max(max).optional().or(z.literal(''));
const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone: optionalText(40),
  company: optionalText(160),
  industry: optionalText(120),
  service: z.string().trim().min(2).max(120),
  budget: optionalText(80),
  message: z.string().trim().min(10).max(5000).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  website: optionalText(200)
}).refine(value => Boolean(value.message || value.description), {
  path: ['message'],
  message: 'A project description is required.'
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone: optionalText(40),
  subject: z.string().trim().min(2).max(180),
  message: z.string().trim().min(2).max(5000),
  website: optionalText(200)
});

export const applicationSchema = z.object({
  job_id: z.string().uuid().optional().or(z.literal('')),
  role: z.string().trim().min(2).max(160),
  applicant_name: z.string().trim().min(2).max(120),
  email,
  phone: optionalText(40),
  message: optionalText(5000),
  website: optionalText(200)
});

export const enquiryStatusSchema = z.object({
  status: z.enum(['new', 'pending', 'in_progress', 'completed', 'closed']).optional(),
  internal_notes: z.string().trim().max(10000).optional()
}).refine(value => Object.keys(value).length > 0);

export const projectSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(180),
  type: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(5000),
  category: z.string().trim().min(2).max(120),
  accent: z.string().trim().max(40).optional().default('blue'),
  display_status: z.string().trim().max(80).optional().default('Project'),
  project_status: z.enum(['planned', 'in_progress', 'completed']).default('completed'),
  image_path: optionalText(1000),
  image_position: z.string().trim().max(40).optional(),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(100000).default(0)
});

export const productSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(5000),
  features: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  image_path: optionalText(1000),
  is_active: z.boolean().default(false),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(100000).default(0)
});

export const demoSchema = z.object({
  product_id: z.string().uuid(),
  title: z.string().trim().min(2).max(180),
  description: optionalText(5000),
  video_path: optionalText(1000),
  video_url: z.string().url().max(2000).refine(value => value.startsWith('https://')).optional().or(z.literal('')),
  thumbnail_path: optionalText(1000),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(100000).default(0)
});

export const jobSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(180),
  department: optionalText(120),
  location: optionalText(160),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship']).default('full_time'),
  description: z.string().trim().min(2).max(5000),
  requirements: z.array(z.string().trim().min(1).max(300)).max(50).default([]),
  status: z.enum(['open', 'closed']).default('open'),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(100000).default(0)
});

export const applicationStatusSchema = z.object({
  status: z.enum(['received', 'reviewing', 'interview', 'rejected', 'hired'])
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(25),
  status: z.string().trim().max(40).optional(),
  search: z.string().trim().max(100).optional()
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(25),
  unread: z.enum(['true', 'false']).optional()
});

export function partialSchema(schema) {
  return schema.partial().refine(value => Object.keys(value).length > 0);
}
