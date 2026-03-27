import { Timestamp } from "firebase/firestore";

export function toJsDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }
  if (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { seconds?: number }).seconds === "number"
  ) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  if (typeof value === "string") {
    const v = value.trim();
    if (!v) return null;
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
  return null;
}

export function toIsoDateInput(value: unknown): string {
  const d = toJsDate(value);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatEventAnnouncementDate(value: unknown): string {
  const d = toJsDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function legacyUpcomingDateMs(data: {
  day?: unknown;
  month?: unknown;
  year?: unknown;
}): number | null {
  const day = typeof data.day === "string" ? data.day.trim() : "";
  const month = typeof data.month === "string" ? data.month.trim() : "";
  const year = typeof data.year === "string" ? data.year.trim() : "";
  if (!day || !month || !year) return null;
  const base = new Date(`01 ${month} ${year}T12:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  const dayNum = parseInt(day, 10);
  if (Number.isNaN(dayNum) || dayNum < 1 || dayNum > 31) return null;
  base.setDate(dayNum);
  return base.getTime();
}

/** Sort key for upcoming events: earliest date first; items without a parseable date last. */
export function upcomingEventSortMs(data: {
  startsAt?: unknown;
  day?: unknown;
  month?: unknown;
  year?: unknown;
}): number {
  const fromStart = data.startsAt != null ? toJsDate(data.startsAt) : null;
  if (fromStart) return fromStart.getTime();
  const legacy = legacyUpcomingDateMs(data);
  if (legacy !== null) return legacy;
  return Number.MAX_SAFE_INTEGER;
}

export function compareUpcomingEventsByDate(
  a: { id?: number; startsAt?: unknown; day?: unknown; month?: unknown; year?: unknown },
  b: { id?: number; startsAt?: unknown; day?: unknown; month?: unknown; year?: unknown },
): number {
  const diff = upcomingEventSortMs(a) - upcomingEventSortMs(b);
  if (diff !== 0) return diff;
  return (a.id ?? 0) - (b.id ?? 0);
}

export function upcomingDisplayParts(data: {
  startsAt?: unknown;
  day?: unknown;
  month?: unknown;
  year?: unknown;
}): { day: string; month: string; year: string } {
  const d = data.startsAt != null ? toJsDate(data.startsAt) : null;
  if (d) {
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      year: String(d.getFullYear()),
    };
  }
  const day = typeof data.day === "string" ? data.day : "";
  const month = typeof data.month === "string" ? data.month : "";
  const year = typeof data.year === "string" ? data.year : "";
  return { day, month, year };
}

export function timestampFromIso(isoDate: string): Timestamp {
  return Timestamp.fromDate(new Date(`${isoDate}T12:00:00`));
}
