"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import type { EventAnnouncement } from "@/lib/events";
import { formatEventAnnouncementDate } from "@/lib/datetime";

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
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="relative grid min-h-[340px] gap-6 p-5 sm:p-6 lg:min-h-[320px] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:p-8">
        {events.length > 1 && (
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={goPrevEvent}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CC0000]/25 bg-white text-[#CC0000] transition-colors hover:bg-[#fff1f1]"
              aria-label={t("hero.eventsPrevious")}
            >
              <HiArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNextEvent}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#CC0000] text-white transition-colors hover:bg-[#b10000]"
              aria-label={t("hero.eventsNext")}
            >
              <HiArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex min-h-[180px] flex-col justify-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#CC0000] sm:text-xs">
            {t("hero.eventsAnnouncement")}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-left"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <h3 className="max-w-xl min-h-[78px] line-clamp-2 pr-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-[36px]">
                {featuredEvent?.title}
              </h3>
              <p className="mt-3 max-w-xl min-h-[52px] line-clamp-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                {featuredEvent?.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-[#CC0000]/10 px-3 py-1 font-semibold text-[#CC0000]">
                  {featuredEvent ? formatEventAnnouncementDate(featuredEvent.date) : ""}
                </span>
                <span className="line-clamp-1 text-slate-500">{featuredEvent?.location}</span>
              </div>

              {featuredEvent && (
                <a
                  href={featuredEvent.ctaHref}
                  className="mt-5 inline-flex w-fit items-center justify-center rounded-xl bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b10000]"
                >
                  {featuredEvent.ctaLabel}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[230px] sm:min-h-[270px] lg:min-h-[290px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-right"}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {featuredEvent && (
                <div className="absolute inset-0 overflow-hidden rounded-xl border border-slate-200">
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

      <div className="border-t border-slate-200 px-5 py-3">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: safeTotal }).map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => setEventIndex(idx)}
              aria-label={`Go to event ${idx + 1} of ${safeTotal}`}
              className={`h-2 rounded-full transition-all ${
                idx === eventIndex ? "w-7 bg-[#CC0000]" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-medium text-slate-500">
          {indexLabel}/{totalLabel}
        </p>
      </div>
    </div>
  );
}
