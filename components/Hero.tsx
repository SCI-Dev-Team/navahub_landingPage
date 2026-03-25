"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/components/I18nProvider";
import { HiChevronDoubleDown } from "react-icons/hi2";

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const { locale, t } = useI18n();
  const rotatingWords =
    locale === "km"
      ? ["កម្ពុជា", "កុមារ", "អនាគត"]
      : ["Cambodia.", "Children.", "the Future."];
  const heroImageUrl = "/image/herosection.png";
  const stats = [
    { value: 120, suffix: "+", label: t("hero.stat.programs") },
    { value: 8000, suffix: "+", label: t("hero.stat.participants"), display: "8K+" },
    { value: 45, suffix: "+", label: t("hero.stat.communities") },
    { value: 24, suffix: "", label: t("hero.stat.provinces") },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (!el) return;

    const navOffset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset + 10;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white min-h-[92vh]">
      {/* Soft background gradients (not the photo) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute " />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-sm font-semibold mb-6 border border-[#CC0000]/20"
            >
              <span className="w-2 h-2 rounded-full" />
              {t("hero.badge")}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4"
            >
              {t("hero.title.line1")}
              <br />
            </motion.h1>

            {/* Rotating word */}
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 h-16 flex items-center overflow-hidden">
              <motion.span
                key={wordIndex}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="text-red-600"
              >
                Build for {rotatingWords[wordIndex]}
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/85 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.display ? (
                      stat.display
                    ) : (
                      <>
                        <CountUp target={stat.value} duration={1800 + i * 200} />
                        {stat.suffix}
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
            <div className="relative h-[500px] sm:h-[560px] lg:h-[640px] overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 animate-hero-zoom bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImageUrl}')` }}
              />

            </div>

        </div>

        {/* Scroll down indicator (center of hero) */}
        <div className="absolute left-1/2 bottom-[-30%] -translate-x-1/2 pointer-events-none">
          <motion.button
            type="button"
            onClick={scrollToProjects}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="pointer-events-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#CC0000]/10 border border-[#CC0000]/20 hover:bg-[#CC0000]/15 transition-colors"
            aria-label={t("hero.scroll")}
          >
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
            >
              <HiChevronDoubleDown className="w-7 h-7 text-[#CC0000]" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
