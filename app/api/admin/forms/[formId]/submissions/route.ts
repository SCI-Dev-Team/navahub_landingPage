import { NextResponse } from "next/server";
import { getAdminDb, requireAdminToken } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ formId: string }> };

// ─── GET /api/admin/forms/[formId]/submissions ────────────────────────────────

export async function GET(request: Request, ctx: RouteContext) {
  try {
    await requireAdminToken(request);
    const { formId } = await ctx.params;

    const db = getAdminDb();
    const snap = await db
      .collection("eventRegistrations")
      .where("formId", "==", formId)
      .orderBy("submittedAt", "desc")
      .get();

    const submissions = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        formId: d.formId as string,
        data: d.data as Record<string, unknown>,
        submittedAt: d.submittedAt?.toMillis?.() ?? null,
      };
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    const err = error as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
