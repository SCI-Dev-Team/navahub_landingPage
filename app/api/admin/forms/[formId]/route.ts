import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, requireAdminToken } from "@/lib/firebaseAdmin";
import type { EventForm, FormField, FormSection } from "@/lib/formBuilder";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ formId: string }> };

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

// ─── GET /api/admin/forms/[formId] ────────────────────────────────────────────

export async function GET(request: Request, ctx: RouteContext) {
  try {
    await requireAdminToken(request);
    const { formId } = await ctx.params;
    const db = getAdminDb();
    const snap = await db.collection("eventForms").doc(formId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

// ─── PUT /api/admin/forms/[formId] ────────────────────────────────────────────

export async function PUT(request: Request, ctx: RouteContext) {
  try {
    await requireAdminToken(request);
    const { formId } = await ctx.params;
    const body = (await request.json()) as Partial<EventForm>;

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Form title is required." }, { status: 400 });
    }

    const updates = {
      title: title.slice(0, 300),
      description: typeof body.description === "string" ? body.description.slice(0, 1000) : "",
      eventRef: typeof body.eventRef === "string" ? body.eventRef.slice(0, 300) : "",
      sections: sanitizeSections(body.sections),
      isPublished: body.isPublished === true,
      updatedAt: FieldValue.serverTimestamp(),
    };

    const db = getAdminDb();
    const ref = db.collection("eventForms").doc(formId);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }
    await ref.update(updates);
    return NextResponse.json({ id: formId, ...updates });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

// ─── DELETE /api/admin/forms/[formId] ─────────────────────────────────────────

export async function DELETE(request: Request, ctx: RouteContext) {
  try {
    await requireAdminToken(request);
    const { formId } = await ctx.params;
    const db = getAdminDb();
    const ref = db.collection("eventForms").doc(formId);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
