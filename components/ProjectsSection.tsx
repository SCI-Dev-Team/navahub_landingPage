"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { HiChevronRight, HiMapPin, HiUsers } from "react-icons/hi2";
import { projects } from "@/lib/projects";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProjectsSection() {
  return (
    <>
      {/* Hero */}
      <section
        id="projects"
        className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-red-50 to-white"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob absolute -top-20 -right-20 w-72 h-72 bg-red-100 rounded-full opacity-40 blur-3xl" />
          <div className="animate-blob-delay absolute bottom-0 left-10 w-56 h-56 bg-orange-100 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-[#CC0000] text-sm font-medium mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse" />
            Cambodia community-built solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Cambodia <span className="text-[#CC0000]">Projects</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Real solutions built by local teams in Cambodia to solve genuine community and child-focused
            challenges.
          </motion.p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block">
                <motion.article
                  variants={card}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{project.emoji}</span>
                      </div>
                      <span className="text-xs text-gray-400">{project.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#CC0000] transition-colors mb-1 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#CC0000] font-medium mb-2">{project.event}</p>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">{project.description}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <HiUsers className="w-3.5 h-3.5 shrink-0" />
                        {project.team} · {project.members} members
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <HiMapPin className="w-3.5 h-3.5 shrink-0" />
                        {project.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-emerald-600">🌍 {project.impact}</span>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="text-xs font-semibold text-[#CC0000] flex items-center gap-0.5"
                      >
                        View project <HiChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

