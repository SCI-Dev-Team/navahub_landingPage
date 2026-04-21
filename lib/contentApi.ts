import type { Locale } from "@/lib/i18n";
import type { EventAnnouncement } from "@/lib/events";
import type { Project } from "@/lib/projects";
import type { UpcomingEvent } from "@/lib/upcomingEvents";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { clientDb } from "@/lib/firebaseClient";
import { DATASET_CONFIG, type Dataset, type FieldConfig } from "@/lib/dataAdmin";
import { compareUpcomingEventsByDate, timestampFromIso } from "@/lib/datetime";

export type ContentPayload = {
  projects: Project[];
  events: EventAnnouncement[];
  upcomingEvents: UpcomingEvent[];
};

export type AdminEntry = {
  docId: string;
  id: number;
  locale: Locale;
  values: Record<string, unknown>;
};

// Short in-memory cache so components sharing the same payload (Hero, ProjectRows, ...)
// don't each issue their own Firestore request when they mount together.
// We intentionally do NOT persist to localStorage: stale content would keep showing
// on visitors' machines for the full TTL after an admin edit.
const CONTENT_CACHE_TTL_MS = 15_000;
const LEGACY_CONTENT_CACHE_KEY_PREFIX = "navahub:content:";

type ContentCacheEntry = {
  data: ContentPayload;
  expiresAt: number;
};

const contentCache = new Map<Locale, ContentCacheEntry>();
const inFlightContentRequests = new Map<Locale, Promise<ContentPayload>>();

function hasWindowStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function clearLegacyStorageCache() {
  if (!hasWindowStorage()) return;
  try {
    for (const locale of ["en", "km"] as const) {
      window.localStorage.removeItem(`${LEGACY_CONTENT_CACHE_KEY_PREFIX}${locale}`);
    }
  } catch {
    // Ignore storage failures (private mode / quota)
  }
}

function writeContentCache(locale: Locale, data: ContentPayload) {
  contentCache.set(locale, {
    data,
    expiresAt: Date.now() + CONTENT_CACHE_TTL_MS,
  });
}

function invalidateContentCache() {
  contentCache.clear();
  inFlightContentRequests.clear();
  clearLegacyStorageCache();
}

function compareById(a: { id?: number }, b: { id?: number }) {
  return (a.id ?? 0) - (b.id ?? 0);
}

export async function fetchContent(locale: Locale): Promise<ContentPayload> {
  // Clean up any stale entries written by previous versions of this module.
  clearLegacyStorageCache();

  const cached = contentCache.get(locale);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.data,
      upcomingEvents: [...cached.data.upcomingEvents].sort(compareUpcomingEventsByDate),
    };
  }

  const activeRequest = inFlightContentRequests.get(locale);
  if (activeRequest) {
    return activeRequest;
  }

  const request = Promise.all([
    getDocs(query(collection(clientDb, "projects"), where("locale", "==", locale))),
    getDocs(query(collection(clientDb, "events"), where("locale", "==", locale))),
    getDocs(query(collection(clientDb, "upcomingEvents"), where("locale", "==", locale))),
  ])
    .then(([projectsSnap, eventsSnap, upcomingSnap]) => {
      const projects = projectsSnap.docs.map((doc) => doc.data() as Project).sort(compareById);
      const events = eventsSnap.docs.map((doc) => doc.data() as EventAnnouncement).sort(compareById);
      const upcomingEvents = upcomingSnap.docs
        .map((doc) => doc.data() as UpcomingEvent)
        .sort(compareUpcomingEventsByDate);
      const payload = { projects, events, upcomingEvents };
      writeContentCache(locale, payload);
      return payload;
    })
    .finally(() => {
      inFlightContentRequests.delete(locale);
    });

  inFlightContentRequests.set(locale, request);
  return request;
}

type CreateContentPayload = {
  dataset: Dataset;
  locale: Locale;
  values: Record<string, string | boolean>;
};

function coerceValue(field: FieldConfig, raw: string | boolean | undefined) {
  if (field.type === "date") {
    const source = typeof raw === "string" ? raw.trim() : "";
    if (field.required && !source) {
      throw new Error(`"${field.label}" is required.`);
    }
    return source;
  }

  if (field.type === "boolean") {
    return raw === true;
  }

  if (field.type === "number") {
    const asNumber = Number(raw);
    if (Number.isNaN(asNumber)) {
      throw new Error(`"${field.label}" must be a number.`);
    }
    return asNumber;
  }

  if (field.type === "string-array") {
    const source = typeof raw === "string" ? raw : "";
    const values = source
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (field.required && values.length === 0) {
      throw new Error(`"${field.label}" is required.`);
    }
    return values;
  }

  const source = typeof raw === "string" ? raw.trim() : "";
  if (field.required && !source) {
    throw new Error(`"${field.label}" is required.`);
  }
  return source;
}

export async function createContentEntry({
  dataset,
  locale,
  values,
}: CreateContentPayload): Promise<{ id: number }> {
  const rows = await getDocs(collection(clientDb, dataset));
  const maxId = rows.docs.reduce((max, doc) => {
    const id = doc.data().id;
    return typeof id === "number" ? Math.max(max, id) : max;
  }, 0);

  const entry: Record<string, unknown> = { id: maxId + 1, locale };
  const fields = DATASET_CONFIG[dataset];

  for (const field of fields) {
    if (dataset === "upcomingEvents" && field.key === "eventDate") {
      const iso = String(coerceValue(field, values[field.key]));
      entry.startsAt = timestampFromIso(iso);
      continue;
    }
    const coerced = coerceValue(field, values[field.key]);
    if (field.type === "date") {
      entry[field.key] = timestampFromIso(String(coerced));
      continue;
    }
    entry[field.key] = coerced;
  }

  await addDoc(collection(clientDb, dataset), entry);
  invalidateContentCache();
  return { id: maxId + 1 };
}

type CreateBilingualContentPayload = {
  dataset: Dataset;
  enValues: Record<string, string | boolean>;
  kmValues: Record<string, string | boolean>;
};

export async function createBilingualContentEntry({
  dataset,
  enValues,
  kmValues,
}: CreateBilingualContentPayload): Promise<{ id: number }> {
  const rows = await getDocs(collection(clientDb, dataset));
  const maxId = rows.docs.reduce((max, doc) => {
    const id = doc.data().id;
    return typeof id === "number" ? Math.max(max, id) : max;
  }, 0);
  const nextId = maxId + 1;

  const fields = DATASET_CONFIG[dataset];
  const enEntry: Record<string, unknown> = { id: nextId, locale: "en" };
  const kmEntry: Record<string, unknown> = { id: nextId, locale: "km" };

  for (const field of fields) {
    if (dataset === "upcomingEvents" && field.key === "eventDate") {
      const enIso = String(coerceValue(field, enValues[field.key]));
      const kmIso = String(coerceValue(field, kmValues[field.key]));
      enEntry.startsAt = timestampFromIso(enIso);
      kmEntry.startsAt = timestampFromIso(kmIso);
      continue;
    }
    const enCoerced = coerceValue(field, enValues[field.key]);
    const kmCoerced = coerceValue(field, kmValues[field.key]);
    if (field.type === "date") {
      enEntry[field.key] = timestampFromIso(String(enCoerced));
      kmEntry[field.key] = timestampFromIso(String(kmCoerced));
      continue;
    }
    enEntry[field.key] = enCoerced;
    kmEntry[field.key] = kmCoerced;
  }

  await Promise.all([addDoc(collection(clientDb, dataset), enEntry), addDoc(collection(clientDb, dataset), kmEntry)]);
  invalidateContentCache();

  return { id: nextId };
}

export async function fetchDatasetEntries(dataset: Dataset, locale: Locale): Promise<AdminEntry[]> {
  const rows = await getDocs(query(collection(clientDb, dataset), where("locale", "==", locale)));

  const entries = rows.docs.map((snapshot) => {
    const data = snapshot.data() as Record<string, unknown>;
    return {
      docId: snapshot.id,
      id: typeof data.id === "number" ? data.id : 0,
      locale,
      values: data,
    };
  });

  if (dataset === "upcomingEvents") {
    return entries.sort((a, b) =>
      compareUpcomingEventsByDate(a.values as UpcomingEvent, b.values as UpcomingEvent),
    );
  }

  return entries.sort((a, b) => a.id - b.id);
}

type UpdateContentPayload = {
  dataset: Dataset;
  docId: string;
  values: Record<string, string | boolean>;
};

export async function updateContentEntry({ dataset, docId, values }: UpdateContentPayload): Promise<void> {
  const fields = DATASET_CONFIG[dataset];
  const nextValues: Record<string, unknown> = {};

  for (const field of fields) {
    if (dataset === "upcomingEvents" && field.key === "eventDate") {
      const iso = String(coerceValue(field, values[field.key]));
      nextValues.startsAt = timestampFromIso(iso);
      continue;
    }
    const coerced = coerceValue(field, values[field.key]);
    if (field.type === "date") {
      nextValues[field.key] = timestampFromIso(String(coerced));
      continue;
    }
    nextValues[field.key] = coerced;
  }

  await updateDoc(doc(clientDb, dataset, docId), nextValues);
  invalidateContentCache();
}

export async function deleteContentEntry(dataset: Dataset, docId: string): Promise<void> {
  const targetRef = doc(clientDb, dataset, docId);
  const targetSnap = await getDoc(targetRef);
  const targetId = targetSnap.data()?.id;

  if (typeof targetId === "number") {
    const siblings = await getDocs(query(collection(clientDb, dataset), where("id", "==", targetId)));
    await Promise.all(siblings.docs.map((snapshot) => deleteDoc(snapshot.ref)));
  } else {
    await deleteDoc(targetRef);
  }

  invalidateContentCache();
}
