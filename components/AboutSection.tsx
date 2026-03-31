"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
  const { locale, t } = useI18n();
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
      {/* Mission */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#222221] mb-5 uppercase tracking-wide">{t("about.mission.title")}</h2>
            <p className="text-[#4A4F53] leading-relaxed mb-5">
              {t("about.mission.p1")}
            </p>
            <p className="text-[#4A4F53] leading-relaxed mb-8">
              {t("about.mission.p2")}
            </p>

            <div className="flex gap-6">
              {[
                { n: "120+", l: t("about.stats.events") },
                { n: "8K+", l: t("about.stats.builders") },
                { n: "45+", l: t("about.stats.communities") },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-extrabold text-[#DA291C]">{s.n}</p>
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
            <div className="rounded-3xl bg-linear-to-br from-[#DA291C] to-[#A51414] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl animate-blob" />
              <div className="mb-4">
                <Image
                  src="/image/about.png"
                  alt="Save the Children"
                  width={160}
                  height={60}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <p className="text-red-100 text-sm leading-relaxed">
                {t("about.card.body")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F2EE]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-10 h-1 bg-[#DA291C] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#222221] mb-2 uppercase tracking-wide">{t("about.values.heading")}</h2>
            <p className="text-[#4A4F53]">{t("about.values.subtitle")}</p>
          </motion.div>

          <motion.div
            key={locale}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={item}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.07)" }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DA291C] flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-[#222221] mb-2">{v.title}</h3>
                <p className="text-sm text-[#4A4F53] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#DA291C]">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-12 text-center uppercase tracking-wide"
          >
            {t("about.timeline.heading")}
          </motion.h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/30" />

            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative flex gap-6 mb-8 pl-20"
              >
                <div className="absolute left-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-red-900/30">
                  <span className="text-[#DA291C] font-extrabold text-sm">{m.year}</span>
                </div>
                <div className="bg-white/10 rounded-xl px-5 py-4 flex-1 border border-white/20">
                  <p className="text-sm text-white/90 leading-relaxed">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

