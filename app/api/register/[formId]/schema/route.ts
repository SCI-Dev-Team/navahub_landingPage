import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import type { EventForm } from "@/lib/formBuilder";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ formId: string }> };

/**
 * GET /api/register/[formId]/schema
 * Public endpoint – returns a form's title, description, and fields
 * only when the form is published. No auth required.
 */
export async function GET(_request: Request, ctx: RouteContext) {
  try {
    const { formId } = await ctx.params;
    const db = getAdminDb();
    const snap = await db.collection("eventForms").doc(formId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }

    const data = snap.data()!;

    if (!data.isPublished) {
      return NextResponse.json(
        { error: "This registration form is not currently open." },
        { status: 403 },
      );
    }

    // Return only what the public page needs — no internal timestamps
    const form: Omit<EventForm, "createdAt" | "updatedAt"> = {
      id: snap.id,
      title: data.title as string,
      description: (data.description as string | undefined) ?? "",
      eventRef: (data.eventRef as string | undefined) ?? "",
      fields: data.fields ?? [],
      sections: data.sections ?? [],
      isPublished: true,
    };

    return NextResponse.json(form);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
