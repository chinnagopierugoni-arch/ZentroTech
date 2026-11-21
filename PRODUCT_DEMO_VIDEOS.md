# Product demo management

The `/products` page loads active, published product/demo records from `GET /api/products`. The initial Supabase migration seeds the existing eight product records and creates one manageable demo record per product.

Administrators can use the protected REST API to:

1. Upload a thumbnail to `POST /api/admin/uploads/product-images`.
2. Upload an MP4/WebM video to `POST /api/admin/uploads/product-videos`.
3. Save the returned Storage path in the corresponding product or demo record using the admin CRUD endpoints.
4. Set `is_active` and `is_published` to control public visibility.

All buckets are private. Public API responses contain signed URLs for published assets; resume files remain private and signed resume links require administrator authentication.

API details, request examples, and upload limits are in [backend/API.md](./backend/API.md).
