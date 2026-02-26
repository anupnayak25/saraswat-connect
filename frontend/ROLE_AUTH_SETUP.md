# Role-Based Authentication Setup

## Overview

The application now uses Supabase authentication with role-based access control. Users can have different roles that
determine their access level and redirect destination after login.

## User Roles

- **user** (default): Regular customers, redirected to home page
- **admin**: Temple administrators, redirected to `/saraswat-admin`
- **hotel-admin**: Hotel managers, redirected to `/hotel`

## Database Changes

### 1. Updated Users Table Schema

The `users` table now includes a `role` column:

```sql
role VARCHAR(50) DEFAULT 'user'
```

### 2. Migration File

Run the migration to add role column to existing databases:

```bash
supabase/migrations/add_role_column.sql
```

## Setup Instructions

### Step 1: Apply Database Schema

1. Open Supabase Dashboard → SQL Editor
2. Run `supabase/schema.sql` to create all tables
3. Run `supabase/migrations/add_role_column.sql` if database already exists
4. **IMPORTANT**: Run `supabase/migrations/create_user_trigger_and_rls.sql` to:
   - Create automatic user record creation trigger
   - Set up Row Level Security (RLS) policies
   - Enable proper access control

### Step 2: Create Admin Users

#### Option A: Via Supabase Dashboard

1. Go to Authentication → Users → Add User
2. Create users with these credentials:
   - Email: `admin@saraswathconnect.com`, Password: `admin123`
   - Email: `hotel@saraswathconnect.com`, Password: `hotel123`

#### Option B: Via SQL (After creating auth users)

1. Create users in Supabase Auth first
2. Run `supabase/seed_admin_users.sql` to set roles

### Step 3: Configure Environment

Make sure `.env.local` has your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Test Login

1. Navigate to `/login`
2. Use demo credentials:
   - Admin: `admin@saraswathconnect.com` / `admin123` → redirects to `/saraswat-admin`
   - Hotel Admin: `hotel@saraswathconnect.com` / `hotel123` → redirects to `/hotel`
   - Regular User: Any other account → redirects to `/`

## Code Changes

### Files Modified

1. **supabase/schema.sql** - Added role column
2. **contexts/AuthContext.js** - Fetches user role from database
3. **app/login/page.js** - Implements role-based redirect
4. **components/saraswat-admin/SaraswatProtectedRoute.js** - Uses Supabase auth
5. **components/saraswat-admin/SaraswatSidebar.js** - Uses Supabase auth

### Files Created

- **supabase/migrations/add_role_column.sql** - Migration for existing databases
- **supabase/seed_admin_users.sql** - Seed admin users with roles

### Files Removed

- **app/saraswat-admin/login/page.js** - Removed hardcoded login

## Protected Routes

### Saraswat Admin Routes

All `/saraswat-admin/*` routes require:

- User must be authenticated
- User role must be `'admin'`

If not authenticated or wrong role, redirected to `/login`

## Testing Checklist

- [ ] Run migrations in order:
  1. `schema.sql` (create tables)
  2. `add_role_column.sql` (if upgrading existing DB)
  3. `create_user_trigger_and_rls.sql` (trigger + RLS policies)
- [ ] Create admin users via Supabase Dashboard or signup page
- [ ] Run seed_admin_users.sql to assign admin roles
- [ ] Test login with admin credentials → should go to /saraswat-admin
- [ ] Test login with hotel-admin credentials → should go to /hotel
- [ ] Test login with regular user → should go to /
- [ ] Test signup - new user should auto-create in users table
- [ ] Verify protected routes redirect to /login if not authenticated
- [ ] Verify admin routes block non-admin users
