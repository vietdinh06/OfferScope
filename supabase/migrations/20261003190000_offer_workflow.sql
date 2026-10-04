create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  attempt_count integer not null default 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists processing_jobs_user_id_idx on public.processing_jobs(user_id);
create index if not exists processing_jobs_status_idx on public.processing_jobs(status);

alter table public.processing_jobs enable row level security;

create policy "Users can view their processing jobs"
  on public.processing_jobs for select
  using (auth.uid() = user_id);

create policy "Users can create their processing jobs"
  on public.processing_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their processing jobs"
  on public.processing_jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.offer_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_ids uuid[] not null,
  preferences jsonb not null default '{}'::jsonb,
  score_breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.offer_comparisons enable row level security;

create policy "Users can manage their offer comparisons"
  on public.offer_comparisons for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
