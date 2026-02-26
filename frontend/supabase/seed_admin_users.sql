-- Seed admin users with roles
-- Make sure to run this after creating users in Supabase Auth

-- Note: Replace these UUIDs with actual auth.users IDs after creating users in Supabase Auth
-- You can create users via Supabase Dashboard > Authentication > Users or via signUp function

-- Example SQL to insert users in users table after creating them in auth.users:
-- Get the auth user ID after creating the user and use it here

-- Admin User (for Saraswat Admin panel)
-- Email: admin@saraswathconnect.com
-- Password: admin123
-- INSERT INTO users (id, email, full_name, role) 
-- VALUES ('PASTE_AUTH_USER_ID_HERE', 'admin@saraswathconnect.com', 'Admin User', 'admin');

-- Hotel Admin User (for Hotel Management panel)
-- Email: hotel@saraswathconnect.com
-- Password: hotel123
-- INSERT INTO users (id, email, full_name, role) 
-- VALUES ('PASTE_AUTH_USER_ID_HERE', 'hotel@saraswathconnect.com', 'Hotel Admin', 'hotel-admin');

-- Regular User (for customer use)
-- Email: user@saraswathconnect.com
-- Password: user123
-- INSERT INTO users (id, email, full_name, role) 
-- VALUES ('PASTE_AUTH_USER_ID_HERE', 'user@saraswathconnect.com', 'Regular User', 'user');


-- INSTRUCTIONS:
-- 1. First, create users in Supabase Auth (Dashboard > Authentication > Users)
--    OR use the signUp API with the following:
--    - admin@saraswathconnect.com / admin123
--    - hotel@saraswathconnect.com / hotel123
--    - user@saraswathconnect.com / user123
--
-- 2. After user creation, Supabase Auth will generate UUID for each user
--
-- 3. Get the auth user IDs by running:
--    SELECT id, email FROM auth.users WHERE email IN (
--      'admin@saraswathconnect.com', 
--      'hotel@saraswathconnect.com', 
--      'user@saraswathconnect.com'
--    );
--
-- 4. Use those IDs in the INSERT statements above (replace PASTE_AUTH_USER_ID_HERE)
--
-- 5. Or use this automated approach if users already exist in auth.users:

-- Automated inserts (assuming users already exist in auth.users)
INSERT INTO users (id, email, full_name, role) 
SELECT id, email, 'Admin User', 'admin'
FROM auth.users 
WHERE email = 'admin@saraswathconnect.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

INSERT INTO users (id, email, full_name, role) 
SELECT id, email, 'Hotel Admin', 'hotel-admin'
FROM auth.users 
WHERE email = 'hotel@saraswathconnect.com'
ON CONFLICT (id) DO UPDATE SET role = 'hotel-admin';

INSERT INTO users (id, email, full_name, role) 
SELECT id, email, 'Regular User', 'user'
FROM auth.users 
WHERE email = 'user@saraswathconnect.com'
ON CONFLICT (id) DO UPDATE SET role = 'user';
