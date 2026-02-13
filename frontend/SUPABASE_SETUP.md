# Supabase Setup Guide for Saraswath Connect

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Next.js project with Supabase client installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - Name: `saraswath-connect`
   - Database Password: (create a strong password and save it)
   - Region: Choose the closest to your users
4. Click "Create new project" and wait for setup to complete

### 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under Project API keys)
   - **anon/public key** (under Project API keys)

### 3. Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `supabase/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to create all tables and policies

### 5. Add Sample Data (Optional)

1. In the SQL Editor, create another new query
2. Copy the content from `supabase/seed.sql`
3. Paste and run it to populate your database with sample data

### 6. Enable Authentication (Optional)

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable "Email" provider (enabled by default)
3. Configure any additional providers you want (Google, GitHub, etc.)

### 7. Storage Setup (For Images)

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `assets`
3. Set it to **Public** for image uploads
4. Configure allowed file types (jpg, png, webp)

## Database Tables Overview

- **rooms** - Temple room listings
- **vehicles** - Available vehicles for rent
- **poojas** - Pooja services offered
- **tour_packages** - Tour package options
- **users** - User profiles (extends Supabase auth)
- **room_bookings** - Room reservation records
- **vehicle_bookings** - Vehicle booking records
- **pooja_bookings** - Pooja booking records
- **tour_package_bookings** - Tour package reservations
- **contact_messages** - Contact form submissions

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- Public read access for services (rooms, vehicles, poojas, packages)
- Users can only read/modify their own bookings
- Authenticated users can create bookings
- Anyone can submit contact messages

## Next Steps

1. Restart your development server: `npm run dev`
2. Test the Supabase connection
3. Start implementing booking features
4. Upload images to Supabase Storage

## Useful Commands

```bash
# Install Supabase CLI (optional)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Pull remote changes
supabase db pull
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
