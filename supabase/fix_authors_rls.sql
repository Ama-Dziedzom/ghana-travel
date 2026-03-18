-- ============================================================
-- FIX: Infinite recursion in authors RLS policies
-- ============================================================
-- The "Admins have full access to authors" policy used a subselect
-- on the authors table itself, causing Postgres to infinitely recurse
-- when evaluating RLS. The fix is a SECURITY DEFINER helper function
-- that checks the role without triggering the authors RLS policy.
-- ============================================================

-- Step 1: Create a security definer function that reads the current
--         user's role from the authors table, bypassing RLS.
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.authors where user_id = auth.uid() limit 1;
$$;

-- Step 2: Drop the broken admin policy on authors
drop policy if exists "Admins have full access to authors" on public.authors;

-- Step 3: Re-create it using the helper function (no self-reference)
create policy "Admins have full access to authors"
  on public.authors for all
  using ( public.get_my_role() = 'admin' );

-- Step 4: Also fix the same pattern on articles (editors/admins policies
--         also subselect from authors — safe now via the function)
drop policy if exists "Editors and admins can read all articles" on public.articles;
create policy "Editors and admins can read all articles"
  on public.articles for select
  using ( public.get_my_role() in ('editor', 'admin') );

drop policy if exists "Editors can update any article" on public.articles;
create policy "Editors can update any article"
  on public.articles for update
  using ( public.get_my_role() in ('editor', 'admin') );

-- Step 5: Fix comments policies that subselect from authors
drop policy if exists "Admins can update comments" on public.comments;
create policy "Admins can update comments"
  on public.comments for update
  using ( public.get_my_role() in ('editor', 'admin') );

drop policy if exists "Admins can delete comments" on public.comments;
create policy "Admins can delete comments"
  on public.comments for delete
  using ( public.get_my_role() = 'admin' );
