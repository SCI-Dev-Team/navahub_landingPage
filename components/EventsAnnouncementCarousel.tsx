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

function shouldDisableImageOptimization(src: string | undefined) {
  if (!src) return false;
  // For any remote URL, avoid server-side optimization fetches (many CDNs block them with 403).
  return /^https?:\/\//i.test(src);
}

export default function EventsAnnouncementCarousel({ events, t }: Props) {
  const [eventIndex, setEventIndex] = useState(0);
  const featuredEvent = events[eventIndex] ?? events[0];
  const disableOptimization = shouldDisableImageOptimization(featuredEvent?.image);
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
    <div className="overflow-hidden border border-gray-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.09)]">
      {/* Red top accent */}
      <div className="h-[3px] bg-[#DA291C]" />

      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        {/* Left: Event content */}
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          {/* Label + counter */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#DA291C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DA291C]" />
              {t("hero.eventsAnnouncement")}
            </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-[#999999]">
              {indexLabel}&nbsp;/&nbsp;{totalLabel}
            </span>
          </div>

          {/* Animated event info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-left"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="mt-6 flex flex-1 flex-col"
            >
              <h3 className="line-clamp-3 min-h-[90px] text-2xl font-black leading-tight tracking-tight text-[#222221] sm:text-3xl lg:text-[34px]">
                {featuredEvent?.title}
              </h3>

              <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-relaxed text-[#4A4F53] sm:text-base">
                {featuredEvent?.description}
              </p>

              {/* Date & location chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#DA291C]/[0.08] px-3 py-1.5 text-xs font-bold text-[#DA291C]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {featuredEvent ? formatEventAnnouncementDate(featuredEvent.date) : ""}
                </span>

                {featuredEvent?.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#4A4F53]">
                    <svg
                      className="h-3.5 w-3.5 flex-shrink-0 text-[#999999]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-1">{featuredEvent.location}</span>
                  </span>
                )}
              </div>

              {/* CTA */}
              {featuredEvent && (
                <a
                  href={featuredEvent.ctaHref}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[#DA291C] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(218,41,28,0.28)] transition-all hover:bg-[#A51414] hover:shadow-[0_6px_20px_rgba(218,41,28,0.35)] active:scale-[0.97]"
                >
                  {featuredEvent.ctaLabel}
                  <HiArrowRight className="h-4 w-4" />
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom: dots + nav */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-1.5">
              {Array.from({ length: safeTotal }).map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  onClick={() => setEventIndex(idx)}
                  aria-label={`Go to event ${idx + 1} of ${safeTotal}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === eventIndex
                      ? "w-8 bg-[#DA291C]"
                      : "w-1.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {events.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevEvent}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#4A4F53] transition-all hover:border-[#DA291C]/30 hover:bg-[#fff1f1] hover:text-[#DA291C]"
                  aria-label={t("hero.eventsPrevious")}
                >
                  <HiArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNextEvent}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#DA291C] text-white shadow-[0_4px_12px_rgba(218,41,28,0.28)] transition-all hover:bg-[#A51414]"
                  aria-label={t("hero.eventsNext")}
                >
                  <HiArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredEvent?.id ?? "empty-right"}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {featuredEvent ? (
                <>
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    unoptimized={disableOptimization}
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle left-edge fade on desktop */}
                  <div className="absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-white to-transparent lg:block" />
                </>
              ) : (
                <div className="h-full bg-slate-100" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
