# Zentro Technologies

React and Vite website with an Express/Supabase backend.

## Local development

```powershell
cd zentro-technologies
npm install
npm run dev
```

In another terminal:

```powershell
cd zentro-technologies\backend
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Vercel environment variables

Set these in the Vercel project settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLIENT_ORIGIN=https://your-production-domain.vercel.app`
- `NODE_ENV=production`
- `TRUST_PROXY=true` only behind a trusted proxy

Do not expose `SUPABASE_SERVICE_ROLE_KEY` through a `VITE_*` variable.

Apply `supabase/migrations/202611220001_educore_enquiry_details.sql` in Supabase before submitting EduCore or product metadata enquiries.