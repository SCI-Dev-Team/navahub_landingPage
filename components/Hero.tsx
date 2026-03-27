"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
    <section
      id="events-announcement"
      className="relative overflow-hidden bg-white px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-56 -top-56 h-[700px] w-[700px] rounded-full bg-[#CC0000]/[0.035]" />
        <div className="absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[#CC0000]/[0.025]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header: text left, GIF right */}
        <div className="mb-10 flex items-center justify-between gap-8 lg:mb-14">
          {/* Left: text content */}
          <div className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#CC0000]/20 bg-[#CC0000]/6 px-4 py-2"
            >
              <span className="pulse-glow h-2.5 w-2.5 rounded-full bg-[#CC0000]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#CC0000]">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className="text-4xl font-black leading-[1.06] tracking-tight text-slate-900 sm:text-5xl lg:text-[62px]"
            >
              {t("hero.title.line1")}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.32, ease: "easeOut" }}
              className="mt-5 h-0.75 w-20 origin-left rounded-full bg-[#CC0000]"
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex items-start gap-4"
            >
              <div className="mt-1 w-0.75 shrink-0 self-stretch rounded-full bg-[#CC0000]/25" />
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#CC0000]">
                  {t("hero.whatIs")}
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {t("hero.subtitle")}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: large GIF */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="hidden shrink-0 lg:block"
          >
            <Image
              src="/image/giphy.gif"
              alt=""
              width={340}
              height={340}
              loading="eager"
              className="h-85 w-85 object-contain"
              unoptimized
            />
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
        >
          <EventsAnnouncementCarousel key={locale} events={announcementEvents} t={t} />
        </motion.div>
      </div>
    </section>
  );
}
