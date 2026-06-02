// Supabase Edge Function: send-booking-email
// Sends booking status emails via SMTP (Gmail) when an admin approves/rejects a booking.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { writeAll } from "https://deno.land/std@0.224.0/io/write_all.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Some SMTP libraries expect Deno.writeAll which is not available in newer runtimes.
// Provide a small polyfill using the standard library.
// deno-lint-ignore no-explicit-any
if (typeof (Deno as any).writeAll !== "function") {
  // deno-lint-ignore no-explicit-any
  (Deno as any).writeAll = writeAll;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "x-request-id",
};

type BookingType = "room" | "vehicle" | "package" | "trip";

type RequestBody = {
  bookingId: string;
  bookingType: string;
  bookingStatus: string;
};

function normalizeBookingType(value: string): BookingType | null {
  const v = (value || "").toLowerCase().trim();
  if (v === "room") return "room";
  if (v === "vehicle") return "vehicle";
  if (v === "package") return "package";
  if (v === "trip") return "trip";
  return null;
}

function statusLabel(status: string): { title: string; short: string } {
  const s = (status || "").toLowerCase().trim();
  if (s === "confirmed") return { title: "Booking Confirmed", short: "confirmed" };
  if (s === "cancelled" || s === "rejected") return { title: "Booking Rejected", short: "rejected" };
  return { title: "Booking Update", short: s || "updated" };
}

function pickQuote(status: string): string {
  const s = (status || "").toLowerCase().trim();
  if (s === "confirmed") {
    return "May your journey be filled with peace, devotion, and beautiful memories.";
  }
  if (s === "cancelled" || s === "rejected") {
    return "Every delay has a purpose — we’ll be here when you’re ready to travel.";
  }
  return "Wishing you a smooth and blessed journey ahead.";
}

function formatDate(value: unknown): string {
  if (!value) return "N/A";
  try {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
  } catch {
    return String(value);
  }
}

serve(async (req: Request) => {
  const requestId = crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...corsHeaders, "x-request-id": requestId } });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
    });
  }

  try {
    console.log("send-booking-email request", {
      requestId,
      method: req.method,
      hasAuth: !!req.headers.get("Authorization"),
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
      return new Response(JSON.stringify({ error: "Missing Supabase environment variables" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      console.error("Missing Authorization header");
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    let body: Partial<RequestBody>;
    try {
      body = (await req.json()) as Partial<RequestBody>;
    } catch (parseError: unknown) {
      console.error("Invalid JSON body", { requestId, parseError });
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    const bookingId = (body.bookingId || "").trim();
    const bookingType = normalizeBookingType(body.bookingType || "");
    const bookingStatus = (body.bookingStatus || "").trim();

    if (!bookingId || !bookingType || !bookingStatus) {
      console.error("Missing required fields", { bookingId: !!bookingId, bookingType: body.bookingType, bookingStatus: body.bookingStatus });
      return new Response(JSON.stringify({ error: "bookingId, bookingType, bookingStatus are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    // Verify caller is an authenticated admin.
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      console.error("auth.getUser failed", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    const { data: roleRow, error: roleError } = await userClient
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (roleError || roleRow?.role !== "admin") {
      console.error("Forbidden: not admin", { roleError, role: roleRow?.role });
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    // Fetch booking details using the caller JWT.
    // This relies on the existing admin RLS policies (recommended; avoids storing service role key in secrets).
    const adminClient = userClient;

    let booking: any;

    if (bookingType === "room") {
      const { data, error } = await adminClient
        .from("room_bookings")
        .select(
          "id, user_id, check_in, check_out, total_price, booking_status, created_at, room:rooms(name), user:users(full_name, email)"
        )
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      booking = { ...data, typeLabel: "Room", itemLabel: data?.room?.name || "Room" };
    }

    if (bookingType === "vehicle") {
      const { data, error } = await adminClient
        .from("vehicle_bookings")
        .select(
          "id, user_id, travel_date, pickup_location, drop_location, total_price, booking_status, created_at, vehicle:vehicles(type, vehicle_number), user:users(full_name, email)"
        )
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      const vehicleLabel = [data?.vehicle?.type, data?.vehicle?.vehicle_number].filter(Boolean).join(" • ") || "Vehicle";
      booking = { ...data, typeLabel: "Vehicle", itemLabel: vehicleLabel };
    }

    if (bookingType === "package") {
      const { data, error } = await adminClient
        .from("package_bookings")
        .select(
          "id, user_id, booking_date, number_of_travelers, total_price, booking_status, created_at, package:packages(name), user:users(full_name, email)"
        )
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      booking = { ...data, typeLabel: "Package", itemLabel: data?.package?.name || "Package" };
    }

    if (bookingType === "trip") {
      const { data, error } = await adminClient
        .from("trip_bookings")
        .select("id, user_id, travel_date, total_price, booking_status, created_at, trip_data, user:users(full_name, email)")
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      const startingPoint = data?.trip_data?.startingPoint?.name || data?.trip_data?.startingPoint || null;
      booking = {
        ...data,
        typeLabel: "Trip",
        itemLabel: startingPoint ? `Trip from ${startingPoint}` : "Trip Planner",
      };
    }

    let recipientEmail = booking?.user?.email || "";
    let recipientName = booking?.user?.full_name || "Guest";

    // Fallback: sometimes the relationship join returns a user object without email
    // (older rows / backfill needed / RLS nuances). Try a direct lookup by user_id.
    if (!recipientEmail && booking?.user_id) {
      const { data: userRow, error: userLookupError } = await adminClient
        .from("users")
        .select("email, full_name")
        .eq("id", booking.user_id)
        .maybeSingle();

      if (userLookupError) {
        console.error("User lookup failed", { requestId, bookingId, bookingType, userLookupError });
      } else if (userRow) {
        recipientEmail = (userRow.email || "").trim();
        recipientName = (userRow.full_name || recipientName || "Guest").trim();
      }
    }

    if (!recipientEmail) {
      const userId = booking?.user_id || null;
      // Attempt to differentiate between missing user row and blank email for better debugging.
      let userRowExists: boolean | null = null;
      let userEmailBlank: boolean | null = null;

      if (userId) {
        const { data: existsRow, error: existsErr } = await adminClient
          .from("users")
          .select("email")
          .eq("id", userId)
          .maybeSingle();
        if (!existsErr) {
          userRowExists = !!existsRow;
          userEmailBlank = existsRow ? !String(existsRow.email || "").trim() : null;
        }
      }

      console.error("Booking user email not found", {
        requestId,
        bookingId,
        bookingType,
        userId,
        userRowExists,
        userEmailBlank,
      });

      const errorMessage = userRowExists === false
        ? "Booking user record not found"
        : "Booking user email not found";

      return new Response(
        JSON.stringify({
          error: errorMessage,
          userId,
          userRowExists,
          userEmailBlank,
        }),
        {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
        }
      );
    }

    const smtpUser = Deno.env.get("SMTP_USER") || "";
    const smtpPass = Deno.env.get("SMTP_PASS") || "";
    const smtpFrom = Deno.env.get("SMTP_FROM") || smtpUser;
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = Number(Deno.env.get("SMTP_PORT") || 465);

    if (!smtpUser || !smtpPass || !smtpFrom) {
      console.error("Missing SMTP secrets", { hasUser: !!smtpUser, hasPass: !!smtpPass, hasFrom: !!smtpFrom });
      return new Response(JSON.stringify({ error: "Missing SMTP secrets (SMTP_USER/SMTP_PASS/SMTP_FROM)" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
      });
    }

    const status = statusLabel(bookingStatus);
    const quote = pickQuote(bookingStatus);

    const detailsLines: string[] = [
      `Booking type: ${booking.typeLabel}`,
      `Item: ${booking.itemLabel}`,
      bookingType === "room"
        ? `Check-in: ${formatDate(booking.check_in)} | Check-out: ${formatDate(booking.check_out)}`
        : bookingType === "vehicle"
          ? `Travel date: ${formatDate(booking.travel_date)} | From: ${booking.pickup_location || "N/A"} | To: ${
              booking.drop_location || "N/A"
            }`
          : bookingType === "package"
            ? `Booking date: ${formatDate(booking.booking_date)} | Travelers: ${booking.number_of_travelers ?? "N/A"}`
            : `Travel date: ${formatDate(booking.travel_date)}`,
      `Total amount: ₹${booking.total_price ?? 0}`,
      `Status: ${bookingStatus}`,
    ];

    const subject = `Saraswat Connect - ${status.title}`;

    const text = [
      `Hi ${recipientName},`,
      "",
      `Your ${booking.typeLabel} booking has been ${status.short}.`,
      "",
      "Booking details:",
      ...detailsLines.map((l) => `- ${l}`),
      "",
      `"${quote}"`,
      "",
      "If you have any questions, please contact us and we’ll be happy to help.",
      "",
      "Regards,",
      "Saraswat Connect",
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi <strong>${recipientName}</strong>,</p>
        <p>Your <strong>${booking.typeLabel}</strong> booking has been <strong>${status.short}</strong>.</p>
        <p><strong>Booking details</strong></p>
        <ul>
          ${detailsLines.map((l) => `<li>${l}</li>`).join("")}
        </ul>
        <p style="margin-top: 16px;"><em>“${quote}”</em></p>
        <p>If you have any questions, please contact us and we’ll be happy to help.</p>
        <p style="margin-top: 16px;">Regards,<br/>Saraswat Connect</p>
      </div>
    `;

    const client = new SmtpClient();
    try {
      console.log("Connecting SMTP", { smtpHost, smtpPort, smtpFrom, to: recipientEmail, bookingType, bookingId, bookingStatus });
      await client.connectTLS({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPass,
      });

      await client.send({
        from: smtpFrom,
        to: recipientEmail,
        subject,
        content: text,
        html,
      });

      console.log("Email sent", { to: recipientEmail, subject });
    } finally {
      try {
        await client.close();
      } catch {
        // ignore
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("send-booking-email failed", { requestId, error: message });
    return new Response(JSON.stringify({ error: message || "Failed to send email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json", "x-request-id": requestId },
    });
  }
});
