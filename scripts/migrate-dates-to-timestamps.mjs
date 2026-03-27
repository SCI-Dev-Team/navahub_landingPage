import { readFile } from "node:fs/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";

const defaultKeyPath = "/Users/bunkheangheng/Downloads/tesing-a3bdf-firebase-adminsdk-6dxoz-0b0489adae.json";

function parseStringToDate(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(`${v}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (/^[A-Za-z]{3}\s\d{4}$/.test(v)) {
    const d = new Date(`01 ${v}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toTimestamp(value) {
  if (value instanceof Timestamp) return value;
  if (value && typeof value.toDate === "function") {
    return Timestamp.fromDate(value.toDate());
  }
  if (value && typeof value.seconds === "number") {
    return new Timestamp(value.seconds, typeof value.nanoseconds === "number" ? value.nanoseconds : 0);
  }
  return null;
}

function upcomingFromParts(day, month, year) {
  if (day == null || month == null || year == null) return null;
  const ds = String(day).trim();
  const ms = String(month).trim();
  const ys = String(year).trim();
  if (!ds || !ms || !ys) return null;
  const d = new Date(`${ms} ${parseInt(ds, 10)}, ${ys}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || defaultKeyPath;
  const sa = JSON.parse(await readFile(keyPath, "utf-8"));
  initializeApp({ credential: cert(sa) });
  const db = getFirestore();
  const batchSize = 400;

  async function commitBatches(writes) {
    for (let i = 0; i < writes.length; i += batchSize) {
      const batch = db.batch();
      for (const { ref, data } of writes.slice(i, i + batchSize)) {
        batch.update(ref, data);
      }
      await batch.commit();
    }
  }

  const stats = { projects: 0, events: 0, upcomingEvents: 0 };

  /* projects: string date -> Timestamp */
  const projectWrites = [];
  const projectsSnap = await db.collection("projects").get();
  for (const docSnap of projectsSnap.docs) {
    const data = docSnap.data();
    const ts = toTimestamp(data.date);
    if (ts) continue;
    const d = parseStringToDate(data.date);
    if (!d) continue;
    projectWrites.push({ ref: docSnap.ref, data: { date: Timestamp.fromDate(d) } });
  }
  if (projectWrites.length) await commitBatches(projectWrites);
  stats.projects = projectWrites.length;

  /* events */
  const eventWrites = [];
  const eventsSnap = await db.collection("events").get();
  for (const docSnap of eventsSnap.docs) {
    const data = docSnap.data();
    const ts = toTimestamp(data.date);
    if (ts) continue;
    const d = parseStringToDate(data.date);
    if (!d) continue;
    eventWrites.push({ ref: docSnap.ref, data: { date: Timestamp.fromDate(d) } });
  }
  if (eventWrites.length) await commitBatches(eventWrites);
  stats.events = eventWrites.length;

  /* upcomingEvents: startsAt from day/month/year; drop legacy fields */
  const upcomingWrites = [];
  const upcomingSnap = await db.collection("upcomingEvents").get();
  for (const docSnap of upcomingSnap.docs) {
    const data = docSnap.data();
    if (toTimestamp(data.startsAt)) continue;
    let d = null;
    if (typeof data.startsAt === "string") {
      d = parseStringToDate(data.startsAt);
    }
    if (!d) d = upcomingFromParts(data.day, data.month, data.year);
    if (!d) continue;
    upcomingWrites.push({
      ref: docSnap.ref,
      data: {
        startsAt: Timestamp.fromDate(d),
        day: FieldValue.delete(),
        month: FieldValue.delete(),
        year: FieldValue.delete(),
      },
    });
  }
  if (upcomingWrites.length) await commitBatches(upcomingWrites);
  stats.upcomingEvents = upcomingWrites.length;

  console.log("Migrated to Firestore Timestamps:", stats);
  console.log("Scanned:", {
    projects: projectsSnap.size,
    events: eventsSnap.size,
    upcomingEvents: upcomingSnap.size,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
