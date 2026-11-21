import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173,http://localhost:5174'),
  TRUST_PROXY: z.enum(['true', 'false']).default('false')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid backend environment: ${details}`);
}

export const env = {
  ...parsed.data,
  clientOrigins: parsed.data.CLIENT_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
};
