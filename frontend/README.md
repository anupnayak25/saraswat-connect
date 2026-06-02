This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

## Booking Email Notifications (Supabase Edge Function)

The Saraswat admin booking approve/reject flow can send an email to the customer via a Supabase Edge Function.

### 1) Create a Gmail App Password

Use a Gmail account with 2-Step Verification enabled, then create an **App Password** (recommended by Google for SMTP usage). Use that app password as `SMTP_PASS`.

### 2) Set Supabase secrets

Set these secrets for the project (values shown are examples):

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_USER=your-gmail@gmail.com`
- `SMTP_PASS=your-gmail-app-password`
- `SMTP_FROM=Saraswat Connect <your-gmail@gmail.com>`

Notes:

- Use a Gmail **App Password** (not your normal Gmail password).
- This function uses the caller’s JWT + existing admin RLS policies, so you do **not** need `SUPABASE_SERVICE_ROLE_KEY`.

### 3) Deploy the function

Deploy the Edge Function from `frontend/supabase/functions/send-booking-email`.

Note: the frontend invokes a function name configured by `NEXT_PUBLIC_BOOKING_EMAIL_FUNCTION` (defaults to `smooth-task`). Your deployed endpoint will look like `.../functions/v1/<function-name>`.

Once deployed, approving/rejecting a booking in the Saraswat admin panel will trigger the email automatically.

### Debugging with Postman

If you get a `500`, check the Edge Function logs and also verify your request.

If you get `{"error":"Booking user email not found"}`, it usually means `public.users.email` is empty for that booking’s user. You can run the backfill migration at `frontend/supabase/migrations/backfill_user_emails.sql` in the Supabase SQL editor. The function may also return diagnostic fields like `userId`, `userRowExists`, and `userEmailBlank`.

If you see `infinite recursion detected in policy for relation "users"` (code `42P17`) in the browser console or Supabase logs, apply `frontend/supabase/migrations/fix_users_rls_recursion.sql` in the Supabase SQL editor to recreate the admin policies in a non-recursive way.

If you get `{"error":"Booking user record not found"}` but you can see that `userId` exists in `public.users`, it’s also an RLS/policy issue. Applying `frontend/supabase/migrations/fix_users_rls_recursion.sql` should resolve it.

**URL**

- `POST https://<project-ref>.supabase.co/functions/v1/smooth-task`

**Headers**

- `apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>`
- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`

**Body (JSON)**

```json
{
	"bookingId": "<uuid>",
	"bookingType": "vehicle",
	"bookingStatus": "confirmed"
}
```

### Troubleshooting: Vehicles admin can’t add/edit/delete

If the Vehicles admin page fails with RLS permission errors, apply the migration in `frontend/supabase/migrations/add_vehicle_admin_policies.sql` to your Supabase database.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
