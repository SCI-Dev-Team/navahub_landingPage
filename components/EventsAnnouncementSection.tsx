"use client";

import { useI18n } from "@/components/I18nProvider";
import { getEventAnnouncements } from "@/lib/events";
import EventsAnnouncementCarousel from "@/components/EventsAnnouncementCarousel";
import { getUpcomingEvents } from "@/lib/upcomingEvents";
import UpcomingEventsTimeline from "@/components/UpcomingEventsTimeline";

export default function EventsAnnouncementSection() {
  const { locale, t } = useI18n();
  const announcementEvents = getEventAnnouncements(locale);
  const upcomingEvents = getUpcomingEvents(locale);

  return (
    <section id="events-announcement" className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <EventsAnnouncementCarousel key={locale} events={announcementEvents} t={t} />

      <UpcomingEventsTimeline events={upcomingEvents} />
    </section>
  );
}
