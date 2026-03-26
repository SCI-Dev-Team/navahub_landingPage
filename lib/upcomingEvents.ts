import type { Locale } from "@/lib/i18n";
import upcomingEventsEn from "@/lib/data/upcomingEvents.en.json";
import upcomingEventsKm from "@/lib/data/upcomingEvents.km.json";

export type UpcomingEvent = {
  id: number;
  day: string;
  month: string;
  year: string;
  title: string;
  type: string;
  typeColor: string;
  location: string;
  spots: string;
  spotsUrgent: boolean;
  image: string;
};

const byLocale: Record<Locale, UpcomingEvent[]> = {
  en: upcomingEventsEn as UpcomingEvent[],
  km: upcomingEventsKm as UpcomingEvent[],
};

export function getUpcomingEvents(locale: Locale): UpcomingEvent[] {
  return byLocale[locale] ?? byLocale.en;
}

