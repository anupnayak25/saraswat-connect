-- Migration: Add role column to users table
-- Run this migration if your users table already exists

-- Add role column with default value 'user'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Add check constraint to ensure only valid roles
ALTER TABLE users
ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'hotel-admin'));

-- Create index on role column for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing users to have 'user' role if null
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Example: Update specific users to admin role
-- UPDATE users SET role = 'admin' WHERE email = 'admin@saraswathconnect.com';
-- UPDATE users SET role = 'hotel-admin' WHERE email = 'hotel@saraswathconnect.com';
