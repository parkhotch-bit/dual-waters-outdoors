// functions/syncICalFeeds.js
// Scheduled Cloud Function — runs every 6 hours.
// Fetches all iCal feed URLs stored on each listing and updates icalBlockedDates[].
//
// Deploy: firebase deploy --only functions:syncICalFeeds
//
// Required packages (in functions/package.json):
//   firebase-functions, firebase-admin, node-fetch (or built-in fetch in Node 18+)

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();

/**
 * syncICalFeeds
 * Scheduled every 6 hours. For each listing that has icalFeeds[],
 * fetches and parses all feeds, then writes the merged blocked-date
 * array back to icalBlockedDates[].
 */
exports.syncICalFeeds = onSchedule(
  {
    schedule: "every 6 hours",
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async () => {
    const db = getFirestore();

    // 1. Find all listings that have at least one iCal feed
    const snap = await db
      .collection("listings")
      .where("icalFeeds", "!=", [])
      .get();

    if (snap.empty) return;

    const results = await Promise.allSettled(
      snap.docs.map((docSnap) => syncListing(db, docSnap))
    );

    // Log failures so they appear in Cloud Function logs
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`Failed to sync listing ${snap.docs[i].id}:`, r.reason);
      }
    });
  }
);

// ── Sync a single listing ────────────────────────────────────
async function syncListing(db, docSnap) {
  const listing = docSnap.data();
  const feeds   = listing.icalFeeds || [];
  if (!feeds.length) return;

  const allDates = new Set();

  // Fetch all feeds in parallel; skip any that fail
  const feedResults = await Promise.allSettled(feeds.map(fetchAndParse));
  feedResults.forEach((r) => {
    if (r.status === "fulfilled") {
      r.value.forEach((d) => allDates.add(d));
    } else {
      console.warn(`Feed fetch failed for listing ${docSnap.id}:`, r.reason?.message);
    }
  });

  // Write merged dates back
  // 🔧 FIREBASE: listings/{listingId} → icalBlockedDates[], icalLastSynced
  await db.collection("listings").doc(docSnap.id).update({
    icalBlockedDates: Array.from(allDates).sort(),
    icalLastSynced: FieldValue.serverTimestamp(),
  });
}

// ── Fetch + parse one iCal URL (Node environment — no CORS proxy needed) ──
async function fetchAndParse(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "DriftWild-CalSync/1.0" },
    signal: AbortSignal.timeout(15_000), // 15s timeout per feed
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  return parseICal(text);
}

// ── Minimal iCal parser (mirrors src/api/icalParser.js) ─────
function parseICal(text) {
  const lines = text
    .replace(/\r\n[ \t]/g, "")
    .replace(/\n[ \t]/g, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const dates = new Set();
  let event = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { event = {}; continue; }
    if (line === "END:VEVENT") {
      if (event?.DTSTART) {
        const start   = parseDate(event.DTSTART);
        const endRaw  = event.DTEND ? parseDate(event.DTEND) : start;
        const isAllDay = !event.DTSTART.includes("T");
        const end = isAllDay && endRaw > start
          ? new Date(endRaw.getTime() - 86400000)
          : endRaw;
        expandRange(start, end).forEach((d) => dates.add(d));
      }
      event = null;
      continue;
    }
    if (event) {
      const ci = line.indexOf(":");
      if (ci === -1) continue;
      const key   = line.slice(0, ci).split(";")[0];
      const value = line.slice(ci + 1);
      event[key]  = value;
    }
  }

  return Array.from(dates).sort();
}

function parseDate(value) {
  if (/^\d{8}$/.test(value)) {
    return new Date(+value.slice(0,4), +value.slice(4,6)-1, +value.slice(6,8));
  }
  if (/^\d{8}T\d{6}/.test(value)) {
    const [y,mo,d,h,mi,s] = [
      +value.slice(0,4), +value.slice(4,6)-1, +value.slice(6,8),
      +value.slice(9,11), +value.slice(11,13), +value.slice(13,15),
    ];
    return value.endsWith("Z")
      ? new Date(Date.UTC(y,mo,d,h,mi,s))
      : new Date(y,mo,d,h,mi,s);
  }
  return new Date(NaN);
}

function toStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function expandRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  const cap = new Date(Math.min(end.getTime(), start.getTime() + 365*86400000));
  while (cur <= cap) { dates.push(toStr(cur)); cur.setDate(cur.getDate()+1); }
  return dates;
}
