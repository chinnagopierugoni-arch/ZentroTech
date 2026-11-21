import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { requireAdmin, requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { HttpError } from './utils/http-error.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (env.TRUST_PROXY === 'true') app.set('trust proxy', 1);

  app.use(pinoHttp({
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    serializers: {
      req(request) {
        return { method: request.method, url: request.url, remoteAddress: request.remoteAddress };
      }
    }
  }));
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'Origin is not allowed by CORS.', 'cors_origin_denied'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json({ limit: '1mb' }));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'rate_limited', message: 'Too many requests. Please try again later.' } }
  });
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', apiLimiter);
  app.get('/api/health', (req, res) => res.json({ data: { status: 'ok' } }));
  app.use('/api/admin', requireAuth, requireAdmin, adminRoutes);
  app.use('/api', publicRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
