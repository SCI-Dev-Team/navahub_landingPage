import type { Locale } from "@/lib/i18n";
import eventsEn from "@/lib/data/events.en.json";
import eventsKm from "@/lib/data/events.km.json";

export type EventAnnouncement = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  ctaLabel: string;
  ctaHref: string;
};

const byLocale: Record<Locale, EventAnnouncement[]> = {
  en: eventsEn as EventAnnouncement[],
  km: eventsKm as EventAnnouncement[],
};

export function getEventAnnouncements(locale: Locale): EventAnnouncement[] {
  return byLocale[locale] ?? byLocale.en;
}
