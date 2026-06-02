-- Fix: infinite recursion detected in policy for relation "users" (42P17)
--
-- Cause: RLS policies on public.users were written using a subquery that also reads
-- public.users (e.g., EXISTS (SELECT 1 FROM public.users ...)). Postgres detects
-- this as recursive evaluation.
--
-- Fix: use a SECURITY DEFINER helper function to check admin status. This runs as
-- the function owner and avoids recursive policy evaluation.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role = 'admin'
  );
$$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop and recreate admin policies to avoid recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE
  USING (public.is_admin());
