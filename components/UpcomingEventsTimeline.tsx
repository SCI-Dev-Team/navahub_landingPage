"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/I18nProvider";
import type { UpcomingEvent } from "@/lib/upcomingEvents";

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
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-[#CC0000] mb-2 font-semibold">
          {t("events.heading")}
        </p>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          {t("events.subtitle")}
        </p>
      </div>

      <ol className="space-y-6 sm:space-y-8">
        {events.map((event, idx) => (
          <motion.li
            key={event.id}
            className="flex gap-5 items-center"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4, delay: idx * 0.03 }}
          >
            <div className="w-10 h-10 rounded-full bg-[#CC0000] flex items-center justify-center shrink-0">
              <span className="text-sm font-extrabold text-white">{roman(idx + 1)}</span>
            </div>

            <div className="flex-1">
              <div className=" bg-[#CC0000] shadow-sm px-5 py-4 transition-all hover:shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date badge */}
                  <div className="w-20 sm:w-24 rounded-xl bg-white px-3 py-2 text-center shrink-0 border border-[#CC0000]/20">
                    <div className="text-xl font-extrabold text-[#CC0000] leading-none">
                      {event.day}
                    </div>
                    <div className="text-xs font-semibold text-[#CC0000] mt-1">
                      {event.month}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-[#CC0000]/80 mt-1">
                      {event.year}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full text-center text-base sm:text-lg font-bold text-white leading-snug">
                      {event.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

