-- Backfill missing emails in public.users from auth.users
-- Useful if the users table existed before email capture/trigger, or if older rows have null/empty email.

UPDATE public.users u
SET email = au.email
FROM auth.users au
WHERE au.id = u.id
  AND (u.email IS NULL OR btrim(u.email) = '');
