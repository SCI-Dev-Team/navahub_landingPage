"use client";

import { motion } from "framer-motion";
import { HiHeart, HiLightBulb, HiGlobeAlt, HiUsers, HiShieldCheck, HiRocketLaunch } from "react-icons/hi2";

const values = [
  { icon: <HiHeart className="w-6 h-6" />,        title: "Community First",   desc: "Every decision we make is rooted in the real needs of the communities we serve." },
  { icon: <HiLightBulb className="w-6 h-6" />,    title: "Innovation",        desc: "We believe technology, in the right hands, can solve the hardest human problems." },
  { icon: <HiGlobeAlt className="w-6 h-6" />,     title: "Inclusivity",       desc: "Navathon is open to everyone — no experience required, just passion to help." },
  { icon: <HiShieldCheck className="w-6 h-6" />,  title: "Trust & Safety",    desc: "All activities uphold Save the Children's safeguarding and child protection standards." },
  { icon: <HiUsers className="w-6 h-6" />,        title: "Collaboration",     desc: "We grow together — participants, mentors, and organizations side by side." },
  { icon: <HiRocketLaunch className="w-6 h-6" />, title: "Real Impact",       desc: "We measure success by lives changed, not lines of code written." },
];

const milestones = [
  { year: "2021", event: "First Navathon held in Phnom Penh with 40 participants." },
  { year: "2022", event: "Expanded to 3 provinces. 12 community solutions launched." },
  { year: "2023", event: "First online Navathon — 600+ participants across 10 countries." },
  { year: "2024", event: "Launched NavaHub platform. 80+ projects submitted." },
  { year: "2025", event: "8,000+ participants. 45+ communities impacted. Growing globally." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-red-50 to-white">
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
            Powered by Save the Children
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6"
          >
            We make technology work <span className="text-[#CC0000]">for children in Cambodia.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            NavaHub is the digital home of Navathon Cambodia, bringing together developers, designers, and
            changemakers to build practical solutions for children and underserved communities.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Mission in Cambodia</h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              Navathon was born out of a simple belief: the best people to solve a community&apos;s problems are the
              people who live them. We partner local tech talent with Save the Children&apos;s deep community knowledge
              to create solutions that actually get used.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Every Navathon is designed around a specific community challenge — water, education, child safety,
              healthcare — and ends with working prototypes handed directly to the communities that need them.
            </p>
            <div className="flex gap-6">
              {[{ n: "120+", l: "Events" }, { n: "8K+", l: "Builders" }, { n: "45+", l: "Communities" }].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-extrabold text-[#CC0000]">{s.n}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual card */}
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
              <h3 className="text-2xl font-bold mb-3">Save the Children</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Save the Children has been working to protect children&apos;s rights and improve their lives for over
                100 years. NavaHub and Navathon are part of their commitment to innovation-led community development.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What We Stand For</h2>
            <p className="text-gray-500">The principles that guide every Navathon.</p>
          </motion.div>
          <motion.div
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
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#CC0000] flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
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
            Our Journey
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
