// Generates a Supabase SQL seed for:
// - places
// - tourist_places (including temples)
// - rooms (hotels/guest houses near those places)
//
// Data sources:
// - OpenStreetMap Overpass API (POIs + accommodations)
// - Wikidata API (images/short descriptions when OSM provides a wikidata tag)
//
// Notes:
// - We DO NOT fabricate prices; `price_per_night` is set to 0.00 when unknown.
// - Room images: uses OSM `image` tag if a URL, else Wikidata image (if wikidata tag exists), else `/assets/room.png`.
// - This script only generates SQL; you run it and paste/execute in Supabase SQL editor.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUT_FILE = path.resolve("./supabase/seed_southwest_india.sql");
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];
const WIKIDATA_SEARCH_URL = "https://www.wikidata.org/w/api.php";
const WIKIDATA_ENTITYDATA = (id) => `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;

// Stable namespace UUID (random but fixed for this repo)
const UUID_NAMESPACE = "9c1b38f5-3e2b-4b4a-9d58-8ad5c8a6f9fd";

const STATES_AND_DESTINATIONS = {
  Karnataka: ["Bengaluru", "Mysuru", "Hampi", "Madikeri", "Udupi"],
  Kerala: ["Kochi", "Munnar", "Thiruvananthapuram", "Wayanad"],
  Goa: ["Panaji", "Old Goa", "Calangute", "Margao"],
  Maharashtra: ["Mumbai", "Pune", "Aurangabad", "Nashik"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function jitter(ms) {
  const spread = Math.max(250, Math.floor(ms * 0.2));
  return ms + Math.floor((Math.random() * 2 - 1) * spread);
}

function uuidv5(name, namespaceUuid = UUID_NAMESPACE) {
  const ns = namespaceUuid.replace(/-/g, "");
  const nsBytes = Buffer.from(ns, "hex");
  const hash = crypto.createHash("sha1");
  hash.update(nsBytes);
  hash.update(Buffer.from(name, "utf8"));
  const buf = hash.digest();

  // Per RFC 4122: set version to 5
  buf[6] = (buf[6] & 0x0f) | 0x50;
  // Set variant to RFC 4122
  buf[8] = (buf[8] & 0x3f) | 0x80;

  const b = buf.subarray(0, 16);
  const hex = b.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJsonb(value) {
  if (value === null || value === undefined) return "NULL";
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function commonsFilePathUrl(fileName, width = 1200) {
  // Use Wikimedia's redirector for stable file access.
  // fileName is like "Example.jpg" (without the "File:" prefix)
  const encoded = encodeURIComponent(fileName);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "AsharyaSeedGenerator/1.0 (contact: local-dev)",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 300)}`);
  }
  return res.json();
}

async function wikidataSearch(name) {
  const url = new URL(WIKIDATA_SEARCH_URL);
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("search", name);
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const data = await fetchJson(url.toString());
  const hit = data?.search?.[0];
  if (!hit?.id) return null;
  return hit.id;
}

async function wikidataEntity(id) {
  const data = await fetchJson(WIKIDATA_ENTITYDATA(id));
  const entity = data?.entities?.[id];
  if (!entity) return null;

  const label = entity?.labels?.en?.value ?? null;
  const description = entity?.descriptions?.en?.value ?? null;

  let coord = null;
  const p625 = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  if (p625?.latitude != null && p625?.longitude != null) {
    coord = { lat: p625.latitude, lon: p625.longitude };
  }

  let imageUrl = null;
  const p18 = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (typeof p18 === "string" && p18.trim()) {
    imageUrl = commonsFilePathUrl(p18.trim());
  }

  return { id, label, description, coord, imageUrl };
}

async function overpass(query, { attempts = 7, baseDelayMs = 1500 } = {}) {
  // Public Overpass instances can be flaky/rate-limited; rotate + retry.
  // POST is recommended for larger queries.
  const body = new URLSearchParams({ data: query });
  const retriable = new Set([408, 429, 500, 502, 503, 504]);

  for (let attempt = 0; attempt < attempts; attempt++) {
    const endpoint = OVERPASS_ENDPOINTS[attempt % OVERPASS_ENDPOINTS.length];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 70_000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": "AsharyaSeedGenerator/1.0 (contact: local-dev)",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body,
        signal: controller.signal,
      });

      if (res.ok) {
        clearTimeout(timeout);
        return res.json();
      }

      clearTimeout(timeout);

      const status = res.status;
      const retryAfter = res.headers.get("retry-after");
      const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : null;

      if (!retriable.has(status) || attempt === attempts - 1) {
        const text = await res.text().catch(() => "");
        const snippet = text ? text.replace(/\s+/g, " ").slice(0, 160) : "";
        throw new Error(`Overpass HTTP ${status} (${endpoint})${snippet ? `: ${snippet}` : ""}`);
      }

      const backoffMs = Math.min(30_000, baseDelayMs * 2 ** attempt);
      const waitMs = retryAfterMs && Number.isFinite(retryAfterMs) ? retryAfterMs : backoffMs;
      await sleep(jitter(waitMs));
    } catch (err) {
      clearTimeout(timeout);

      const isAbort = err?.name === "AbortError";
      if (!isAbort && attempt === attempts - 1) throw err;

      const backoffMs = Math.min(30_000, baseDelayMs * 2 ** attempt);
      await sleep(jitter(backoffMs));
    }
  }

  throw new Error("Overpass failed after retries");
}

async function overpassBatch(queries, opts) {
  const out = [];
  for (const q of queries) {
    const res = await overpass(q, opts);
    out.push(...(res.elements || []));
    // tiny delay between Overpass requests
    await sleep(350);
  }
  return out;
}

function getCenter(element) {
  if (element?.lat != null && element?.lon != null) return { lat: element.lat, lon: element.lon };
  if (element?.center?.lat != null && element?.center?.lon != null)
    return { lat: element.center.lat, lon: element.center.lon };
  return null;
}

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return null;
}

function pickAttractionType(tags = {}) {
  if (tags.amenity === "place_of_worship") return "temple";
  if (tags.historic) return tags.historic;
  if (tags.natural) return tags.natural;
  if (tags.tourism) return tags.tourism;
  return "attraction";
}

function extractAmenities(tags = {}) {
  const amenities = [];
  if (tags.internet_access && tags.internet_access !== "no") amenities.push("WiFi");
  if (tags.wifi && tags.wifi !== "no") amenities.push("WiFi");
  if (tags.air_conditioning && tags.air_conditioning !== "no") amenities.push("AC");
  if (tags.breakfast && tags.breakfast !== "no") amenities.push("Breakfast");
  if (tags.parking && tags.parking !== "no") amenities.push("Parking");
  if (tags.restaurant && tags.restaurant !== "no") amenities.push("Restaurant");
  if (tags.swimming_pool && tags.swimming_pool !== "no") amenities.push("Pool");
  return [...new Set(amenities)];
}

async function buildDestination(state, destinationName) {
  const searchId = await wikidataSearch(`${destinationName}`);
  let wd = null;
  if (searchId) {
    wd = await wikidataEntity(searchId);
  }

  if (!wd?.coord) {
    throw new Error(`Could not resolve coordinates for destination: ${destinationName} (${state})`);
  }

  const placeId = uuidv5(`place:${state}:${destinationName}`);
  const place = {
    id: placeId,
    name: destinationName,
    description: wd?.description ?? `${destinationName}, ${state}, India`,
    image_url: wd?.imageUrl,
    state,
    coord: wd.coord,
    wikidata_id: wd?.id ?? null,
  };

  // 1) Tourist places + temples around destination
  const R_ATTR = 15000; // meters
  const base = (filters, outLimit) => `
[out:json][timeout:60];
(
  node(around:${R_ATTR},${wd.coord.lat},${wd.coord.lon})[name]${filters};
  way(around:${R_ATTR},${wd.coord.lat},${wd.coord.lon})[name]${filters};
);
out center ${outLimit};
`;

  const attractionQueries = [
    base('[tourism~"^(attraction|museum|viewpoint|zoo|theme_park|gallery|aquarium)$"]', 60),
    base("[historic]", 60),
    base('[natural~"^(beach|waterfall|peak|bay|cave_entrance)$"]', 60),
    // Temples / places of worship (keep it bounded)
    base('[amenity="place_of_worship"]', 90),
    base('[building="temple"]', 60),
  ];

  const attractionElements = await overpassBatch(attractionQueries, { attempts: 8, baseDelayMs: 2000 });

  // Deduplicate by name+type, keep a bounded number
  const touristPlaces = [];
  const seenTp = new Set();

  for (const el of attractionElements) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name) continue;

    const type = pickAttractionType(tags);
    const key = `${type}::${name.toLowerCase()}`;
    if (seenTp.has(key)) continue;
    seenTp.add(key);

    const center = getCenter(el);
    if (!center) continue;

    let imageUrl = normalizeUrl(tags.image);

    // Try Wikidata if present
    const wikidataId = tags.wikidata;
    if (!imageUrl && wikidataId && /^Q\d+$/.test(wikidataId)) {
      try {
        const ent = await wikidataEntity(wikidataId);
        imageUrl = ent?.imageUrl ?? null;
        // be gentle to Wikidata
        await sleep(120);
      } catch {
        // ignore
      }
    }

    touristPlaces.push({
      id: uuidv5(`tourist_place:${placeId}:${el.type}:${el.id}`),
      name,
      type,
      place_id: placeId,
      open_hours: tags.opening_hours ?? null,
      entry_fee: 0,
      description: tags.description ?? tags.note ?? null,
      image_url: imageUrl,
    });

    if (touristPlaces.length >= 25) break;
  }

  // 2) Rooms/hotels around destination
  const R_ROOMS = 8000;
  const roomsQuery = `
[out:json][timeout:60];
(
  node(around:${R_ROOMS},${wd.coord.lat},${wd.coord.lon})[name][tourism~"^(hotel|guest_house|hostel|motel|resort|apartment|camp_site)$"];
  way(around:${R_ROOMS},${wd.coord.lat},${wd.coord.lon})[name][tourism~"^(hotel|guest_house|hostel|motel|resort|apartment|camp_site)$"];
  relation(around:${R_ROOMS},${wd.coord.lat},${wd.coord.lon})[name][tourism~"^(hotel|guest_house|hostel|motel|resort|apartment|camp_site)$"];
);
out center 80;
`;

  const roomsRes = await overpass(roomsQuery, { attempts: 8, baseDelayMs: 2000 });
  const rooms = [];
  const seenRooms = new Set();

  for (const el of roomsRes.elements || []) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name) continue;

    const key = `${name.toLowerCase()}::${tags.tourism ?? "room"}`;
    if (seenRooms.has(key)) continue;
    seenRooms.add(key);

    let imageUrl = normalizeUrl(tags.image);
    const wikidataId = tags.wikidata;
    if (!imageUrl && wikidataId && /^Q\d+$/.test(wikidataId)) {
      try {
        const ent = await wikidataEntity(wikidataId);
        imageUrl = ent?.imageUrl ?? null;
        await sleep(120);
      } catch {
        // ignore
      }
    }

    rooms.push({
      id: uuidv5(`room:${placeId}:${el.type}:${el.id}`),
      name,
      type: tags.tourism ?? "hotel",
      place_id: placeId,
      contact: tags.phone ?? tags["contact:phone"] ?? null,
      price_per_night: 0,
      availability_status: "available",
      max_guests: null,
      amenities: extractAmenities(tags),
      image_url: imageUrl ?? "/assets/room.png",
    });

    if (rooms.length >= 12) break;
  }

  return { place, touristPlaces, rooms };
}

function buildNearbyPlaceMap(placeIds) {
  // Simple: recommend other destinations in the same run.
  return placeIds.reduce((acc, id) => {
    acc[id] = placeIds.filter((x) => x !== id);
    return acc;
  }, {});
}

function toSql(destinations) {
  const lines = [];
  lines.push("-- Auto-generated by scripts/generate_southwest_seed.mjs");
  lines.push("-- States: Karnataka, Kerala, Goa, Maharashtra");
  lines.push("-- Sources: OpenStreetMap Overpass + Wikidata (for images when possible)");
  lines.push("-- Note: price_per_night is set to 0.00 when unknown (not fabricated)");
  lines.push("\nBEGIN;\n");

  const placeIds = destinations.map((d) => d.place.id);
  const nearbyMap = buildNearbyPlaceMap(placeIds);

  // Places
  lines.push("-- places");
  for (const d of destinations) {
    const p = d.place;
    const nearby = nearbyMap[p.id] ?? [];
    lines.push(
      `INSERT INTO places (id, name, description, nearby_places, image_url, updated_at) VALUES (` +
        `${sqlString(p.id)}, ${sqlString(p.name)}, ${sqlString(p.description)}, ${sqlJsonb(nearby)}, ${sqlString(p.image_url)}, NOW()` +
        `) ON CONFLICT (id) DO UPDATE SET ` +
        `name = EXCLUDED.name, description = EXCLUDED.description, nearby_places = EXCLUDED.nearby_places, image_url = EXCLUDED.image_url, updated_at = NOW();`,
    );
  }

  // Tourist places
  lines.push("\n-- tourist_places");
  for (const d of destinations) {
    for (const tp of d.touristPlaces) {
      lines.push(
        `INSERT INTO tourist_places (id, name, type, place_id, open_hours, entry_fee, description, image_url, updated_at) VALUES (` +
          `${sqlString(tp.id)}, ${sqlString(tp.name)}, ${sqlString(tp.type)}, ${sqlString(tp.place_id)}, ${sqlString(tp.open_hours)}, ${tp.entry_fee}, ${sqlString(tp.description)}, ${sqlString(tp.image_url)}, NOW()` +
          `) ON CONFLICT (id) DO UPDATE SET ` +
          `name = EXCLUDED.name, type = EXCLUDED.type, place_id = EXCLUDED.place_id, open_hours = EXCLUDED.open_hours, entry_fee = EXCLUDED.entry_fee, description = EXCLUDED.description, image_url = EXCLUDED.image_url, updated_at = NOW();`,
      );
    }
  }

  // Rooms
  lines.push("\n-- rooms");
  for (const d of destinations) {
    for (const r of d.rooms) {
      lines.push(
        `INSERT INTO rooms (id, name, type, place_id, contact, price_per_night, availability_status, max_guests, amenities, image_url, updated_at) VALUES (` +
          `${sqlString(r.id)}, ${sqlString(r.name)}, ${sqlString(r.type)}, ${sqlString(r.place_id)}, ${sqlString(r.contact)}, ${Number(r.price_per_night).toFixed(2)}, ${sqlString(r.availability_status)}, ${r.max_guests ?? "NULL"}, ${sqlJsonb(r.amenities)}, ${sqlString(r.image_url)}, NOW()` +
          `) ON CONFLICT (id) DO UPDATE SET ` +
          `name = EXCLUDED.name, type = EXCLUDED.type, place_id = EXCLUDED.place_id, contact = EXCLUDED.contact, price_per_night = EXCLUDED.price_per_night, availability_status = EXCLUDED.availability_status, max_guests = EXCLUDED.max_guests, amenities = EXCLUDED.amenities, image_url = EXCLUDED.image_url, updated_at = NOW();`,
      );
    }
  }

  lines.push("\nCOMMIT;\n");
  return lines.join("\n");
}

async function main() {
  const results = [];

  for (const [state, destinations] of Object.entries(STATES_AND_DESTINATIONS)) {
    for (const dest of destinations) {
      console.log(`Fetching: ${dest} (${state})`);
      try {
        const data = await buildDestination(state, dest);
        results.push(data);
        // be polite to public APIs
        await sleep(900);
      } catch (err) {
        console.warn(`Skipping ${dest} (${state}): ${err.message}`);
      }
    }
  }

  const sql = toSql(results);
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, sql, "utf8");

  console.log(`\nWrote SQL seed: ${OUT_FILE}`);
  console.log(`Destinations: ${results.length}`);
}

await main();
