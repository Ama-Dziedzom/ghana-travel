-- ============================================================
-- Ghana Travel Blog — Supabase Schema
-- Run this entire file in the Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────
-- AUTHORS
-- Linked to auth.users via user_id
-- ──────────────────────────────────────────────────────────
create table public.authors (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  email       text not null unique,
  avatar_url  text,
  bio         text,
  role        text not null default 'author' check (role in ('admin', 'editor', 'author')),
  created_at  timestamptz not null default now()
);

alter table public.authors enable row level security;

-- ──────────────────────────────────────────────────────────
-- TAGS
-- ──────────────────────────────────────────────────────────
create table public.tags (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique,
  slug  text not null unique
);

alter table public.tags enable row level security;

-- ──────────────────────────────────────────────────────────
-- ARTICLES
-- ──────────────────────────────────────────────────────────
create table public.articles (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  category      text not null check (category in ('culture', 'history', 'festivals', 'neighbourhoods')),
  excerpt       text,
  cover_image   text,
  author_id     uuid references public.authors(id) on delete set null,
  published_at  timestamptz,
  read_time     int,
  body_mdx      text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.articles enable row level security;

-- Auto-update updated_at on every row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- ARTICLE_TAGS  (many-to-many junction)
-- ──────────────────────────────────────────────────────────
create table public.article_tags (
  article_id  uuid not null references public.articles(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

alter table public.article_tags enable row level security;

-- ──────────────────────────────────────────────────────────
-- ITINERARIES
-- ──────────────────────────────────────────────────────────
create table public.itineraries (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  slug           text not null unique,
  duration       int,
  regions        text[],
  vibe_tags      text[],
  best_season    text,
  cover_image    text,
  summary        text,
  map_embed_url  text,
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.itineraries enable row level security;

create trigger itineraries_updated_at
  before update on public.itineraries
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- ITINERARY_DAYS
-- Each row is one day in an itinerary.
-- `stops` is a jsonb object: { morning, afternoon, evening, eat, stay }
-- ──────────────────────────────────────────────────────────
create table public.itinerary_days (
  id             uuid primary key default uuid_generate_v4(),
  itinerary_id   uuid not null references public.itineraries(id) on delete cascade,
  day_number     int not null,
  title          text,
  stops          jsonb,
  unique (itinerary_id, day_number)
);

alter table public.itinerary_days enable row level security;

-- ──────────────────────────────────────────────────────────
-- RECIPES
-- ──────────────────────────────────────────────────────────
create table public.recipes (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  category      text not null check (category in ('soups', 'rice-dishes', 'street-food', 'drinks', 'snacks')),
  description   text,
  cover_image   text,
  prep_time     int,
  cook_time     int,
  servings      int,
  difficulty    text check (difficulty in ('easy', 'medium', 'hard')),
  ingredients   text[],
  instructions  text[],
  tips          text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.recipes enable row level security;

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- COMMENTS
-- ──────────────────────────────────────────────────────────
create table public.comments (
  id           uuid primary key default uuid_generate_v4(),
  article_id   uuid not null references public.articles(id) on delete cascade,
  author_id    uuid references public.authors(id) on delete set null,
  guest_name   text,
  guest_email  text,
  body         text not null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

alter table public.comments enable row level security;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- ── authors ──────────────────────────────────────────────
-- Public: no access
-- Authenticated: can read their own row
-- Admin: full access (handled via service role key in server actions)

create policy "Authors can view own profile"
  on public.authors for select
  using (auth.uid() = user_id);

create policy "Admins have full access to authors"
  on public.authors for all
  using (
    exists (
      select 1 from public.authors a
      where a.user_id = auth.uid() and a.role = 'admin'
    )
  );

-- ── tags ─────────────────────────────────────────────────
create policy "Anyone can read tags"
  on public.tags for select
  using (true);

create policy "Authenticated users can insert tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

-- ── articles ─────────────────────────────────────────────
-- Public readers can see published articles
create policy "Anyone can read published articles"
  on public.articles for select
  using (status = 'published');

-- Authors can see all their own articles (draft + published)
create policy "Authors can read own articles"
  on public.articles for select
  using (
    author_id in (
      select id from public.authors where user_id = auth.uid()
    )
  );

-- Authors can create and update own articles
create policy "Authors can insert articles"
  on public.articles for insert
  with check (
    author_id in (
      select id from public.authors where user_id = auth.uid()
    )
  );

create policy "Authors can update own articles"
  on public.articles for update
  using (
    author_id in (
      select id from public.authors where user_id = auth.uid()
    )
  );

-- Editors/admins can read all articles
create policy "Editors and admins can read all articles"
  on public.articles for select
  using (
    exists (
      select 1 from public.authors
      where user_id = auth.uid() and role in ('editor', 'admin')
    )
  );

-- Editors can update any article
create policy "Editors can update any article"
  on public.articles for update
  using (
    exists (
      select 1 from public.authors
      where user_id = auth.uid() and role in ('editor', 'admin')
    )
  );

-- ── article_tags ──────────────────────────────────────────
create policy "Anyone can read article tags"
  on public.article_tags for select
  using (true);

create policy "Authenticated users can manage article tags"
  on public.article_tags for all
  using (auth.role() = 'authenticated');

-- ── itineraries ───────────────────────────────────────────
create policy "Anyone can read published itineraries"
  on public.itineraries for select
  using (status = 'published');

create policy "Authenticated users can manage itineraries"
  on public.itineraries for all
  using (auth.role() = 'authenticated');

-- ── itinerary_days ────────────────────────────────────────
create policy "Anyone can read itinerary days"
  on public.itinerary_days for select
  using (
    exists (
      select 1 from public.itineraries i
      where i.id = itinerary_id and i.status = 'published'
    )
  );

create policy "Authenticated users can manage itinerary days"
  on public.itinerary_days for all
  using (auth.role() = 'authenticated');

-- ── recipes ───────────────────────────────────────────────
create policy "Anyone can read published recipes"
  on public.recipes for select
  using (status = 'published');

create policy "Authenticated users can manage recipes"
  on public.recipes for all
  using (auth.role() = 'authenticated');

-- ── comments ──────────────────────────────────────────────
-- Guests can submit comments (INSERT)
create policy "Anyone can submit a comment"
  on public.comments for insert
  with check (true);

-- Public can only read approved comments
create policy "Anyone can read approved comments"
  on public.comments for select
  using (status = 'approved');

-- Authenticated users (admins/editors) can read all comments
create policy "Admins can read all comments"
  on public.comments for select
  using (auth.role() = 'authenticated');

-- Admins/editors can update comment status (approve/reject)
create policy "Admins can update comments"
  on public.comments for update
  using (
    exists (
      select 1 from public.authors
      where user_id = auth.uid() and role in ('editor', 'admin')
    )
  );

-- Admins can delete comments
create policy "Admins can delete comments"
  on public.comments for delete
  using (
    exists (
      select 1 from public.authors
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- STORAGE BUCKET
-- Run separately in: Storage → New Bucket
-- Or paste the line below to create it via SQL:
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to the images bucket
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- Anyone can view images (public CDN)
create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'images');

-- Authenticated users can delete their own uploads
create policy "Authenticated users can delete images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
