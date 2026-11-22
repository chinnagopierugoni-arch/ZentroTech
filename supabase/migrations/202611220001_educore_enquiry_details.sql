alter table public.project_enquiries
  add column if not exists industry text,
  add column if not exists selected_product text,
  add column if not exists selected_package text
    check (selected_package is null or selected_package in ('Starter', 'Professional', 'Enterprise')),
  add column if not exists requirements jsonb not null default '{}'::jsonb;
