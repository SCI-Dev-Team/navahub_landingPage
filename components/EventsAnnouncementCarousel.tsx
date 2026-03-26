"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { EventAnnouncement } from "@/lib/events";

type Props = {
  events: EventAnnouncement[];
  t: (key: string) => string;
};

export default function EventsAnnouncementCarousel({ events, t }: Props) {
  const [eventIndex, setEventIndex] = useState(0);
  const featuredEvent = events[eventIndex] ?? events[0];

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
    <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#aa0000] bg-[#CC0000]">
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white">
          {t("hero.eventsAnnouncement")}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredEvent?.id ?? "empty"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="min-h-[420px] flex flex-col"
          >
            {featuredEvent && (
              <>
                <div className="relative w-full h-52 sm:h-60 overflow-hidden mb-5">
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    loading="eager"
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(min-width: 1024px) 36rem, (min-width: 640px) 80vw, 100vw"
                  />
                </div>

                <p className="text-sm text-[#CC0000] font-semibold mb-2 h-5">{featuredEvent.date}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-3">
                  <span className="block h-[70px] overflow-hidden">{featuredEvent.title}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 h-[96px] overflow-hidden">
                  {featuredEvent.description}
                </p>
                <p className="text-sm text-gray-500 mb-6 h-5">{featuredEvent.location}</p>

                <a
                  href={featuredEvent.ctaHref}
                  className="mt-auto inline-flex items-center justify-center px-3.5 py-2.5 rounded-full bg-[#CC0000] text-white text-sm font-semibold hover:bg-[#aa0000] transition-colors"
                >
                  {featuredEvent.ctaLabel}
                </a>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {events.length > 1 && featuredEvent && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setEventIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === eventIndex ? "w-7 bg-[#CC0000]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`${t("hero.eventsGoTo")} ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevEvent}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:text-[#CC0000] hover:border-[#CC0000]/40 transition-colors"
                aria-label={t("hero.eventsPrevious")}
              >
                {t("hero.eventsPrevious")}
              </button>
              <button
                type="button"
                onClick={goNextEvent}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:text-[#CC0000] hover:border-[#CC0000]/40 transition-colors"
                aria-label={t("hero.eventsNext")}
              >
                {t("hero.eventsNext")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
