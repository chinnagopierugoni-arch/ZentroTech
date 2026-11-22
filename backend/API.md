# Zentro API

Base URL: `http://localhost:5000/api`

Successful responses use `{ "data": ... }` unless the status is `204`. Errors use `{ "error": { "code": "...", "message": "..." } }`. Request bodies are JSON except multipart file uploads.

## Public endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` or `/api/health` | Liveness check |
| `POST` | `/enquiries` | Project enquiry submission |
| `POST` | `/contacts` | General contact message submission |
| `POST` | `/job-applications` | Career application; optional PDF `resume` |
| `GET` | `/portfolio` | Published projects and signed image URLs |
| `GET` | `/products` | Active, published products and published demos |
| `GET` | `/jobs` | Open, published job openings |

### Project enquiry

```json
{
  "name": "A. Visitor",
  "email": "visitor@example.com",
  "phone": "+91 8100000000",
  "company": "Example Ltd",
  "industry": "Healthcare",
  "service": "Custom Software",
  "budget": "10k-25k",
  "message": "We need a workflow platform for our team.",
  "selectedProduct": "Zentro EduCore",
  "selectedPackage": "Professional",
  "institutionType": "Training institute",
  "studentCount": "500-2,000",
  "currentLmsStatus": "Using a third-party LMS",
  "currentCrmStatus": "No CRM yet",
  "requiredFeatures": "Admissions workflow and custom reports",
  "deploymentTimeline": "1-3 months",
  "additionalRequirements": "Discuss a custom learner domain."
}
```

The API inserts into `project_enquiries`, mapping `name` to `full_name` and `message` (or `description`) to `message`. Required: `name`, valid `email`, `service`, and a 10–5000 character message. `budget`, `phone`, `company`, and `industry` are optional. EduCore enquiries can additionally include `selectedProduct`, `selectedPackage`, and the optional organisation requirements shown above. Selected product and package are stored in dedicated columns; the remaining EduCore requirements are stored as a JSON object. The package is limited to `Starter`, `Professional`, or `Enterprise`. The table supplies the `id`, `status`, and `created_at`; the API only returns success when Supabase returns that inserted record. Public submissions are rate limited.

Apply `supabase/migrations/202611220001_educore_enquiry_details.sql` to an existing Supabase project before deploying the updated backend. It adds the enquiry metadata columns while preserving existing records and endpoints.

### Contact

The API inserts into the existing `contact_messages` table, mapping `name` to `full_name`. Required: `name`, `email`, `subject`, and `message`. The current table has no `phone` or `status` column.

### Career application

Applications are inserted into the existing `career_applications` table. The API maps `applicant_name` to `full_name` and `role` (or a validated opening title) to `position`; optional uploaded PDF storage paths are saved in `resume_url`. The table supplies the ID and creation time, and the API only returns success after Supabase returns the inserted row. The website supports an optional PDF attachment:

```json
{ "role": "General interest", "applicant_name": "A. Applicant", "email": "applicant@example.com" }
```

To attach a resume, send `multipart/form-data` fields `role`, `email`, optional `job_id`, `applicant_name`, `phone`, `message`, and a `resume` file. Only PDF files up to 5 MB are accepted. Resume objects are stored in the private `resumes` bucket.

## Authentication and authorization

Sign in with the browser Supabase client, then send its access token as:

```http
Authorization: Bearer <supabase-access-token>
```

Every `/admin` route verifies the token with Supabase Auth and checks the authenticated user ID against `admin_users.is_active` on the server. A JWT without an active admin record receives `403`. The service-role key is used only by the backend and is never returned by an endpoint.

## Admin endpoints

All paths below are prefixed with `/api/admin` and require administrator access.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/me` | Current verified admin and profile |
| `GET` | `/dashboard` | Counts and latest notifications |
| `GET` | `/enquiries?page=1&page_size=25&status=new&search=...` | Search/filter enquiries |
| `GET` | `/enquiries/:id` | Enquiry details |
| `PATCH` | `/enquiries/:id` | Set status and/or internal notes |
| `DELETE` | `/enquiries/:id` | Delete an enquiry |
| `GET` | `/contacts?page=1&page_size=25&status=new&search=...` | Search/filter contact messages |
| `PATCH` | `/contacts/:id` | Set contact status and/or internal notes |
| `GET` | `/notifications?page=1&page_size=25&unread=true` | List notifications |
| `PATCH` | `/notifications/:id/read` | Mark notification read |
| `GET`, `POST` | `/portfolio-projects` | List/create projects |
| `PATCH`, `DELETE` | `/portfolio-projects/:id` | Edit/delete a project |
| `GET`, `POST` | `/products` | List/create products |
| `PATCH`, `DELETE` | `/products/:id` | Edit/delete a product |
| `GET`, `POST` | `/product-demos` | List/create demos |
| `PATCH`, `DELETE` | `/product-demos/:id` | Edit/delete a demo |
| `GET`, `POST` | `/job-openings` | List/create job openings |
| `PATCH`, `DELETE` | `/job-openings/:id` | Edit/delete an opening |
| `GET` | `/job-applications?page=1&page_size=25&status=received&search=...` | List/search applications |
| `PATCH` | `/job-applications/:id` | Update application status |
| `GET` | `/job-applications/:id/resume-url` | Create a private 60-second resume URL |
| `POST` | `/uploads/portfolio-images` | Upload JPEG/PNG/WebP, max 8 MB |
| `POST` | `/uploads/product-images` | Upload JPEG/PNG/WebP, max 8 MB |
| `POST` | `/uploads/product-videos` | Upload MP4/WebM, max 150 MB |

Admin create/update request fields follow the database columns (`is_published`, `is_active`, `image_path`, `video_path`, etc.). Uploads use multipart field `file`; save the returned `path` on the intended project/product/demo. Uploaded objects use random names and detected file signatures rather than the client filename or MIME claim.

List endpoints return `{ "data": [...], "count": n }`; paginated enquiry/contact/application/notification endpoints additionally return `page`, `pageSize`, and `total`.

## Storage and privacy

The migration creates private buckets `portfolio-images`, `product-images`, `product-videos`, and `resumes`. Public APIs create time-limited signed URLs only for published records. Resume URLs are only issued by an authenticated admin endpoint. Storage access policies permit admin users; service-role backend operations bypass RLS as intended.

## Status values

- Enquiries: `new`, `pending`, `in_progress`, `completed`, `closed`
- Contacts: `new`, `read`, `closed`
- Applications: `received`, `reviewing`, `interview`, `rejected`, `hired`
- Job openings: `open`, `closed`
- Portfolio project lifecycle: `planned`, `in_progress`, `completed`; publish separately with `is_published`

## Operational limits

- JSON request bodies: 1 MB
- General API rate limit: 300 requests per IP / 15 minutes
- Public form submissions: 8 requests per IP / 15 minutes
- CORS allows only exact origins listed in `CLIENT_ORIGIN`
- `TRUST_PROXY=true` should only be used behind a trusted hosting proxy
