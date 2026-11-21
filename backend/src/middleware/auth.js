import { supabase } from '../config/supabase.js';
import { HttpError } from '../utils/http-error.js';
import { asyncHandler } from '../utils/async-handler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) throw new HttpError(401, 'Sign in is required.', 'unauthorized');

  const { data, error } = await supabase.auth.getUser(tokenMatch[1]);
  if (error || !data.user) throw new HttpError(401, 'Your session is invalid or expired.', 'unauthorized');
  req.user = data.user;
  next();
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user?.id) throw new HttpError(401, 'Sign in is required.', 'unauthorized');
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id, role, is_active')
    .eq('user_id', req.user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new HttpError(503, 'Unable to verify administrator access.', 'authorization_unavailable');
  if (!data) throw new HttpError(403, 'Administrator access is required.', 'forbidden');
  req.admin = data;
  next();
});
