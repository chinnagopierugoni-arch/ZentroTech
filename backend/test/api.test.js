import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

process.env.SUPABASE_URL ||= 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'test-service-role-key-not-for-production';
process.env.CLIENT_ORIGIN ||= 'http://localhost:5173,http://localhost:5174';

const { createApp } = await import('../src/app.js');
let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('health endpoint responds without Supabase network access', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('CORS rejects origins outside the configured client allowlist', async () => {
  const response = await fetch(`${baseUrl}/health`, { headers: { Origin: 'https://untrusted.example' } });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, 'cors_origin_denied');
});

test('CORS permits the Vite frontend on port 5174', async () => {
  const response = await fetch(`${baseUrl}/api/job-applications`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5174',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type'
    }
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5174');
});

test('admin endpoints reject requests without a bearer token', async () => {
  const response = await fetch(`${baseUrl}/api/admin/dashboard`);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, 'unauthorized');
});

test('malformed JSON receives a client error rather than an internal error', async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{'
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, 'invalid_json');
});

test('invalid public enquiry is rejected before database access', async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'not-an-email', service: '', message: 'short' })
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, 'validation_error');
});

test('the enquiry honeypot never returns success without inserting a record', async () => {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ website: 'bot-filled-this' })
  });
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error.code, 'submission_not_processed');
});
