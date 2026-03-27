"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiMapPin, HiChevronRight } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";
import { fetchContent } from "@/lib/contentApi";
import type { UpcomingEvent } from "@/lib/upcomingEvents";
import { upcomingDisplayParts } from "@/lib/datetime";

export default function UpcomingEvents() {
  const { locale, t } = useI18n();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetchContent(locale)
      .then((data) => {
        if (!isMounted) return;
        setEvents(data.upcomingEvents);
      })
      .catch(() => {
        if (!isMounted) return;
        setEvents([]);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <section id="upcoming" className="py-20 px-4 sm:px-6 bg-[#f9f6f6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-black mb-2">{t("events.heading")}</h2>
            <p className="text-black">{t("events.subtitle")}</p>
          </motion.div>
          <motion.a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#CC0000] hover:text-[#aa0000]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ x: 4 }}
          >
            {t("events.calendar")} <HiChevronRight className="w-4 h-4" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => {
            const { day, month, year } = upcomingDisplayParts(event);
            return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
                <img
                  src={event.image ?? ""}
                  alt={event.title}
                  loading="lazy"
                  className="block w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-linear-to-br from-black/55 via-black/20 to-[#CC0000]/20" />
              </div>

              {/* Content */}
              <div className="pt-8 pb-5 px-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${event.typeColor}`}>
                    {event.type}
                  </span>                 
                </div>

                <h3 className="text-sm font-bold text-black group-hover:text-[#CC0000] transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs text-black/80 mt-2 font-medium flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#CC0000]/10 text-[#CC0000]">
                    {/* simple clock dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] inline-block" />
                  </span>
                  <span className="text-black/70">Deadline:</span>
                  <span className="text-black">
                    {day} {month} {year}
                  </span>
                </p>

                <p className="text-xs text-black/80 mt-2 flex items-center gap-1">
                  <HiMapPin className="w-3 h-3 shrink-0" />
                  {event.location}
                </p>

                <div className="mt-4 flex items-center justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 24px rgba(204,0,0,0.30)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#CC0000] text-white hover:bg-[#aa0000] transition-colors whitespace-nowrap"
                  >
                    {t("events.join")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
