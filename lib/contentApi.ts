import type { Locale } from "@/lib/i18n";
import type { EventAnnouncement } from "@/lib/events";
import type { Project } from "@/lib/projects";
import type { UpcomingEvent } from "@/lib/upcomingEvents";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
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

function compareById(a: { id?: number }, b: { id?: number }) {
  return (a.id ?? 0) - (b.id ?? 0);
}

export async function fetchContent(locale: Locale): Promise<ContentPayload> {
  const [projectsSnap, eventsSnap, upcomingSnap] = await Promise.all([
    getDocs(query(collection(clientDb, "projects"), where("locale", "==", locale))),
    getDocs(query(collection(clientDb, "events"), where("locale", "==", locale))),
    getDocs(query(collection(clientDb, "upcomingEvents"), where("locale", "==", locale))),
  ]);

  const projects = projectsSnap.docs.map((doc) => doc.data() as Project).sort(compareById);
  const events = eventsSnap.docs.map((doc) => doc.data() as EventAnnouncement).sort(compareById);
  const upcomingEvents = upcomingSnap.docs
    .map((doc) => doc.data() as UpcomingEvent)
    .sort(compareUpcomingEventsByDate);

  return { projects, events, upcomingEvents };
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
}

export async function deleteContentEntry(dataset: Dataset, docId: string): Promise<void> {
  await deleteDoc(doc(clientDb, dataset, docId));
}
