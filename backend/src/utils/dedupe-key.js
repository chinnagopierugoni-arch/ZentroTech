import { createHash } from 'node:crypto';

export function makeDedupeKey(fields) {
  const day = new Date().toISOString().slice(0, 10);
  const normalized = Object.entries(fields)
    .map(([key, value]) => `${key}:${String(value ?? '').trim().toLowerCase()}`)
    .sort()
    .join('|');
  return createHash('sha256').update(`${day}|${normalized}`).digest('hex');
}
