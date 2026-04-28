import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import QRCode from "qrcode";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { validateSubmission, normalizeSections, getAllFields, type FormField } from "@/lib/formBuilder";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ formId: string }> };

// ─── POST /api/register/[formId] – public form submission ────────────────────

export async function POST(request: Request, ctx: RouteContext) {
  try {
    const { formId } = await ctx.params;
    const db = getAdminDb();

    // 1. Fetch the form schema
    const formSnap = await db.collection("eventForms").doc(formId).get();
    if (!formSnap.exists) {
      return NextResponse.json({ error: "Registration form not found." }, { status: 404 });
    }
    const formData = formSnap.data()!;
    if (!formData.isPublished) {
      return NextResponse.json({ error: "This registration form is not currently open." }, { status: 403 });
    }

    // Support both new (sections) and old (flat fields) format
    const sections = normalizeSections({
      sections: formData.sections ?? [],
      fields: (formData.fields ?? []) as FormField[],
    });
    const fields = getAllFields(sections);

    // 2. Parse and validate submission body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new Error("Invalid body");
      }
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validationError = validateSubmission(fields, body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 422 });
    }

    // 3. Sanitize – keep only keys matching field ids, coerce types
    const sanitized: Record<string, string | boolean | number | string[]> = {};
    for (const field of fields) {
      const raw = body[field.id];

      if (field.type === "checkbox") {
        sanitized[field.id] = raw === true || raw === "true";
        continue;
      }

      if (field.type === "checkbox-group") {
        const arr = Array.isArray(raw)
          ? raw.filter((o): o is string => typeof o === "string").map((o) => o.slice(0, 500))
          : [];
        sanitized[field.id] = arr;
        continue;
      }

      if (raw === undefined || raw === null) {
        sanitized[field.id] = "";
        continue;
      }

      if (field.type === "number") {
        sanitized[field.id] = Number(raw);
      } else {
        sanitized[field.id] = String(raw).slice(0, 2000);
      }
    }

    // 4. Generate 6-digit confirmation code
    const confirmationCode = String(Math.floor(100000 + Math.random() * 900000));
    const qrDataUrl = await QRCode.toDataURL(confirmationCode, { width: 256, margin: 2 });

    // 5. Store submission
    await db.collection("eventRegistrations").add({
      formId,
      data: sanitized,
      confirmationCode,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, confirmationCode, qrDataUrl, message: "Registration submitted successfully!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
