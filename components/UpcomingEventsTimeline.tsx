"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/I18nProvider";
import type { UpcomingEvent } from "@/lib/upcomingEvents";
import { upcomingDisplayParts } from "@/lib/datetime";

function roman(n: number) {
  const map: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
  };
  return map[n] ?? String(n);
}

export default function UpcomingEventsTimeline({
  events,
}: {
  events: UpcomingEvent[];
}) {
  const { t } = useI18n();

  if (!events.length) return null;

  return (
    <div className="mt-14 pb-2">
      <div className="mb-8">
        {/* Red top rule — brand holding device */}
        <div className="w-10 h-1 bg-[#DA291C] mb-3" />
        <p className="text-sm sm:text-base text-[#4A4F53] max-w-2xl">
          {t("events.subtitle")}
        </p>
      </div>

      <ol className="space-y-4 sm:space-y-5">
        {events.map((event, idx) => {
          const { day, month, year } = upcomingDisplayParts(event);
          return (
            <motion.li
              key={event.id}
              className="flex gap-4 sm:gap-5 items-stretch"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              {/* Roman numeral indicator */}
              <div className="w-9 h-9 rounded-full bg-[#DA291C] flex items-center justify-center shrink-0 mt-1">
                <span className="text-sm font-extrabold text-white">{roman(idx + 1)}</span>
              </div>

              <div className="flex-1">
                {/* White card with red left border accent */}
                <div className="bg-white border border-gray-100 border-l-4 border-l-[#DA291C] shadow-sm px-5 py-4 transition-all hover:shadow-md hover:border-l-[#A51414]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Date badge — small red bg with white text (compliant: compact badge, not large text block) */}
                    <div className="w-20 sm:w-22 rounded-lg bg-[#DA291C] px-3 py-2 text-center shrink-0">
                      <div className="text-xl font-extrabold text-white leading-none">
                        {day}
                      </div>
                      <div className="text-xs font-semibold text-white/90 mt-1 uppercase tracking-wider">
                        {month}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-white/80 mt-0.5">
                        {year}
                      </div>
                    </div>

                    {/* Title — dark text on white bg */}
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-bold text-[#222221] leading-snug">
                        {event.title}
                      </div>
                      {event.location && (
                        <p className="text-sm text-[#4A4F53] mt-1">{event.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
