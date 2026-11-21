import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
import { HttpError } from './http-error.js';

export function createStoragePath(prefix, fileType) {
  const extension = fileType.ext === 'jpeg' ? 'jpg' : fileType.ext;
  return `${prefix}/${randomUUID()}.${extension}`;
}

export async function uploadPrivateFile(bucket, path, buffer, contentType) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType,
    upsert: false
  });
  if (error) throw new HttpError(502, 'File storage is temporarily unavailable.', 'storage_error');
  return data.path;
}

export async function removePrivateFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new HttpError(502, 'Unable to clean up uploaded file.', 'storage_cleanup_error');
}

export async function signedAssetUrl(bucket, path, expiresIn = 3600) {
  if (!path) return null;
  if (/^https:\/\//i.test(path)) return path;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw new HttpError(502, 'Unable to access stored media.', 'storage_url_error');
  return data.signedUrl;
}
