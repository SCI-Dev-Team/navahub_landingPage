"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import type { EventAnnouncement } from "@/lib/events";
import EventsAnnouncementCarousel from "@/components/EventsAnnouncementCarousel";
import type { UpcomingEvent } from "@/lib/upcomingEvents";
import UpcomingEventsTimeline from "@/components/UpcomingEventsTimeline";
import { fetchContent } from "@/lib/contentApi";

export default function EventsAnnouncementSection() {
  const { locale, t } = useI18n();
  const [announcementEvents, setAnnouncementEvents] = useState<EventAnnouncement[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetchContent(locale)
      .then((data) => {
        if (!isMounted) return;
        setAnnouncementEvents(data.events);
        setUpcomingEvents(data.upcomingEvents);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnnouncementEvents([]);
        setUpcomingEvents([]);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <section id="events-announcement" className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <EventsAnnouncementCarousel key={locale} events={announcementEvents} t={t} />

      <UpcomingEventsTimeline events={upcomingEvents} />
    </section>
  );
}
