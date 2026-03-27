"use client";

import { motion } from "framer-motion";
import {
  HiGlobeAlt,
  HiHeart,
  HiLightBulb,
  HiRocketLaunch,
  HiShieldCheck,
  HiUsers,
} from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function AboutSection() {
  const { t } = useI18n();
  const values = [
    {
      icon: <HiHeart className="w-6 h-6" />,
      title: t("about.values.communityFirst.title"),
      desc: t("about.values.communityFirst.desc"),
    },
    {
      icon: <HiLightBulb className="w-6 h-6" />,
      title: t("about.values.innovation.title"),
      desc: t("about.values.innovation.desc"),
    },
    {
      icon: <HiGlobeAlt className="w-6 h-6" />,
      title: t("about.values.inclusivity.title"),
      desc: t("about.values.inclusivity.desc"),
    },
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: t("about.values.trustSafety.title"),
      desc: t("about.values.trustSafety.desc"),
    },
    {
      icon: <HiUsers className="w-6 h-6" />,
      title: t("about.values.collaboration.title"),
      desc: t("about.values.collaboration.desc"),
    },
    {
      icon: <HiRocketLaunch className="w-6 h-6" />,
      title: t("about.values.realImpact.title"),
      desc: t("about.values.realImpact.desc"),
    },
  ];

  const milestones = [
    { year: "2021", event: t("about.timeline.2021") },
    { year: "2022", event: t("about.timeline.2022") },
    { year: "2023", event: t("about.timeline.2023") },
    { year: "2024", event: t("about.timeline.2024") },
    { year: "2025", event: t("about.timeline.2025") },
  ];

  return (
    <>
      {/* Hero */}
      <section
        id="about"
        className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-red-50 to-white"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob absolute -top-20 -left-20 w-80 h-80 bg-red-100 rounded-full opacity-40 blur-3xl" />
          <div className="animate-blob-delay absolute top-10 right-10 w-64 h-64 bg-orange-100 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-[#CC0000] text-sm font-medium mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse" />
            {t("about.hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6"
          >
            {t("about.hero.title.before")} <span className="text-[#CC0000]">{t("about.hero.title.accent")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            {t("about.hero.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-5">{t("about.mission.title")}</h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              {t("about.mission.p1")}
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              {t("about.mission.p2")}
            </p>

            <div className="flex gap-6">
              {[
                { n: "120+", l: t("about.stats.events") },
                { n: "8K+", l: t("about.stats.builders") },
                { n: "45+", l: t("about.stats.communities") },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-extrabold text-[#CC0000]">{s.n}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl bg-linear-to-br from-[#CC0000] to-orange-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl animate-blob" />
              <p className="text-5xl mb-4">🌏</p>
              <h3 className="text-2xl font-bold mb-3">{t("about.card.title")}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t("about.card.body")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            {t("about.timeline.heading")}
          </motion.h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-100" />

            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative flex gap-6 mb-8 pl-20"
              >
                <div className="absolute left-0 w-16 h-16 rounded-2xl bg-[#CC0000] flex items-center justify-center shadow-md shadow-red-200">
                  <span className="text-white font-extrabold text-sm">{m.year}</span>
                </div>
                <div className="bg-gray-50 rounded-xl px-5 py-4 flex-1 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

