import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, requireAdminToken } from "@/lib/firebaseAdmin";
import type { EventForm, FormField, FormSection } from "@/lib/formBuilder";

export const runtime = "nodejs";

// ─── helpers ──────────────────────────────────────────────────────────────────

const ALLOWED_FIELD_TYPES = ["text", "email", "phone", "textarea", "select", "checkbox", "checkbox-group", "number"];

function sanitizeFields(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((f): f is Record<string, unknown> => f !== null && typeof f === "object")
    .map((f) => {
      const field: FormField = {
        id: typeof f.id === "string" ? f.id : crypto.randomUUID(),
        type: ALLOWED_FIELD_TYPES.includes(String(f.type)) ? (f.type as FormField["type"]) : "text",
        label: typeof f.label === "string" ? f.label.slice(0, 200) : "Field",
        required: f.required === true,
      };
      if (typeof f.placeholder === "string") field.placeholder = f.placeholder.slice(0, 200);
      if ((field.type === "select" || field.type === "checkbox-group") && Array.isArray(f.options)) {
        field.options = (f.options as unknown[])
          .filter((o): o is string => typeof o === "string")
          .map((o) => o.slice(0, 200));
      }
      return field;
    });
}

function sanitizeSections(raw: unknown): FormSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is Record<string, unknown> => s !== null && typeof s === "object")
    .map((s) => ({
      id: typeof s.id === "string" ? s.id : crypto.randomUUID(),
      title: typeof s.title === "string" ? s.title.slice(0, 200) : "Section",
      description: typeof s.description === "string" ? s.description.slice(0, 500) : "",
      fields: sanitizeFields(s.fields),
    }));
}

// ─── GET /api/admin/forms  – list all forms ───────────────────────────────────

export async function GET(request: Request) {
  try {
    await requireAdminToken(request);
    const db = getAdminDb();
    const snap = await db.collection("eventForms").orderBy("createdAt", "desc").get();
    const forms = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ forms });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

// ─── POST /api/admin/forms  – create a new form ───────────────────────────────

export async function POST(request: Request) {
  try {
    await requireAdminToken(request);
    const body = (await request.json()) as Partial<EventForm>;

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Form title is required." }, { status: 400 });
    }

    const newForm = {
      title: title.slice(0, 300),
      description: typeof body.description === "string" ? body.description.slice(0, 1000) : "",
      eventRef: typeof body.eventRef === "string" ? body.eventRef.slice(0, 300) : "",
      sections: sanitizeSections(body.sections),
      isPublished: body.isPublished === true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const db = getAdminDb();
    const ref = await db.collection("eventForms").add(newForm);
    return NextResponse.json({ id: ref.id, ...newForm }, { status: 201 });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
