"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import type { EventAnnouncement } from "@/lib/events";

type Props = {
  events: EventAnnouncement[];
  t: (key: string) => string;
};

export default function EventsAnnouncementCarousel({ events, t }: Props) {
  const [eventIndex, setEventIndex] = useState(0);
  const featuredEvent = events[eventIndex] ?? events[0];
  const safeTotal = Math.max(events.length, 1);
  const indexLabel = String(eventIndex + 1).padStart(2, "0");
  const totalLabel = String(safeTotal).padStart(2, "0");

  useEffect(() => {
    if (events.length <= 1) return;

    const timer = setInterval(() => {
      setEventIndex((current) => (current + 1) % events.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [events.length]);

  const goPrevEvent = () => {
    if (!events.length) return;
    setEventIndex((current) => (current - 1 + events.length) % events.length);
  };

  const goNextEvent = () => {
    if (!events.length) return;
    setEventIndex((current) => (current + 1) % events.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 px-6 sm:px-8 lg:px-12 pt-12 pb-8 lg:pt-16 min-h-[620px] lg:min-h-[560px]">
        <div className="flex flex-col justify-center min-h-[360px]">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-[#CC0000] mb-5">
            {t("hero.eventsAnnouncement")}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-left"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] leading-tight max-w-xl min-h-[144px] line-clamp-3">
                {featuredEvent?.title}
              </h3>
              <p className="mt-5 text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl min-h-[96px] line-clamp-3">
                {featuredEvent?.description}
              </p>
              <p className="mt-5 text-sm font-semibold text-[#CC0000]">{featuredEvent?.date}</p>
              <p className="mt-1 text-sm text-gray-500 min-h-[20px] line-clamp-1">{featuredEvent?.location}</p>

              {featuredEvent && (
                <a
                  href={featuredEvent.ctaHref}
                  className="mt-8 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#CC0000] text-white text-sm font-semibold hover:bg-[#aa0000] transition-colors w-fit"
                >
                  {featuredEvent.ctaLabel}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-right"}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {featuredEvent && (
                <div className="absolute inset-2 sm:inset-6 overflow-hidden shadow-2xl">
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 42vw, 88vw"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {events.length > 1 && (
        <div className="relative px-6 sm:px-8 lg:px-12 pb-8">
          <div className="flex items-center justify-between border-t border-[#CC0000]/20 pt-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold text-[#CC0000]">{indexLabel}</span>
              <span>/</span>
              <span>{totalLabel}</span>
              <div className="ml-3 h-[2px] w-16 sm:w-24 bg-gray-200 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#CC0000] transition-all duration-300"
                  style={{ width: `${((eventIndex + 1) / safeTotal) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevEvent}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#CC0000]/30 text-[#CC0000] hover:bg-[#fff1f1] transition-colors"
                aria-label={t("hero.eventsPrevious")}
              >
                <HiArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNextEvent}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-[#CC0000] text-white hover:bg-[#aa0000] transition-colors"
                aria-label={t("hero.eventsNext")}
              >
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
