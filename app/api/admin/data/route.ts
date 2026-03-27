import { NextResponse } from "next/server";
import { DATASET_CONFIG, type Dataset, type FieldConfig, type Locale } from "@/lib/dataAdmin";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type CreatePayload = {
  dataset: Dataset;
  locale: Locale;
  values: Record<string, unknown>;
};

function isDataset(value: string): value is Dataset {
  return value in DATASET_CONFIG;
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "km";
}

function coerceValue(field: FieldConfig, raw: unknown): string | number | boolean | string[] {
  if (field.type === "boolean") {
    return raw === true || raw === "true";
  }

  if (field.type === "number") {
    const asNumber = Number(raw);
    if (Number.isNaN(asNumber)) {
      throw new Error(`"${field.label}" must be a number.`);
    }
    return asNumber;
  }

  if (field.type === "string-array") {
    if (typeof raw !== "string") {
      throw new Error(`"${field.label}" must be a comma-separated string.`);
    }
    const values = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (field.required && values.length === 0) {
      throw new Error(`"${field.label}" is required.`);
    }
    return values;
  }

  if (typeof raw !== "string") {
    throw new Error(`"${field.label}" must be text.`);
  }

  const value = raw.trim();
  if (field.required && !value) {
    throw new Error(`"${field.label}" is required.`);
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreatePayload>;

    if (!body.dataset || !isDataset(body.dataset)) {
      return NextResponse.json({ error: "Invalid dataset." }, { status: 400 });
    }

    if (!body.locale || !isLocale(body.locale)) {
      return NextResponse.json({ error: "Invalid locale." }, { status: 400 });
    }

    const values = body.values ?? {};
    const fieldConfig = DATASET_CONFIG[body.dataset];

    const db = getAdminDb();
    const collectionRef = db.collection(body.dataset);

    const localeSnapshot = await collectionRef.where("locale", "==", body.locale).get();
    const maxId = localeSnapshot.docs.reduce((max, doc) => {
      const id = doc.data().id;
      return typeof id === "number" ? Math.max(max, id) : max;
    }, 0);

    const newItem: Record<string, unknown> = { id: maxId + 1, locale: body.locale };

    for (const field of fieldConfig) {
      const rawFieldValue = values[field.key];
      newItem[field.key] = coerceValue(field, rawFieldValue);
    }

    await collectionRef.add(newItem);

    return NextResponse.json({
      success: true,
      message: `Created ${body.dataset} item #${newItem.id} in Firebase (${body.locale}).`,
      item: newItem,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
