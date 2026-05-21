const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") ?? "").trim();
  const limit = Number(searchParams.get("limit") ?? 1);

  if (!query) {
    return Response.json([], { status: 200 });
  }

  const url = `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=${Number.isNaN(limit) ? 1 : limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "saraswat-connect/1.0 (dev)",
      },
    });

    if (!response.ok) {
      return Response.json([], { status: 200 });
    }

    const data = await response.json();
    return Response.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return Response.json([], { status: 200 });
  }
}
