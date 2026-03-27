"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/components/I18nProvider";
import type { EventAnnouncement } from "@/lib/events";
import { fetchContent } from "@/lib/contentApi";
import EventsAnnouncementCarousel from "@/components/EventsAnnouncementCarousel";

export default function Hero() {
  const { locale, t } = useI18n();
  const [announcementEvents, setAnnouncementEvents] = useState<EventAnnouncement[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetchContent(locale)
      .then((data) => {
        if (!isMounted) return;
        setAnnouncementEvents(data.events);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnnouncementEvents([]);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <section id="events-announcement" className="bg-[#f8f8f8] px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#CC0000]/10 px-4 py-2 text-sm font-semibold text-[#CC0000]"
            >
              <span className="h-2 w-2 rounded-full bg-[#CC0000]" />
              {t("hero.badge")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[58px]"
            >
              {t("hero.title.line1")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#CC0000]"
            >
              <span className="h-2 w-2 rounded-full bg-[#CC0000]" />
              {t("hero.whatIs")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>

          <div className="border-t border-slate-200 bg-[#f3f4f6] p-3 sm:p-4">
            <EventsAnnouncementCarousel key={locale} events={announcementEvents} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
