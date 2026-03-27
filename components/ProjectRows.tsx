"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { HiMapPin } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";
import { fetchContent } from "@/lib/contentApi";
import type { Project } from "@/lib/projects";

const projectImageById: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  2: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  3: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
  4: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  5: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
  6: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
};
const defaultProjectImage =
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80";

const sectionContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const rowItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProjectRows() {
  const { locale, t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetchContent(locale)
      .then((data) => {
        if (!isMounted) return;
        setProjects(data.projects);
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects([]);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <section id="projects" className="mt-5 py-20 px-4 sm:px-6 lg:px-8 bg-[#CC0000]">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">{t("projects.heading")}</h2>
          <p className="text-white/80">{t("projects.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-6"
        >
          {projects.map((project, index) => {
            const hasExternalLink = typeof project.externalLink === "string" && project.externalLink.trim().length > 0;
            const href = hasExternalLink ? project.externalLink!.trim() : `/projects/${project.id}`;

            return hasExternalLink ? (
              <a
                key={project.id}
                href={href}
                className="group block transition-all duration-300 hover:-translate-y-0.5"
              >
                <motion.article variants={rowItem} className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div
                      className={`relative h-72 w-full overflow-hidden md:h-[360px] ${
                        index % 2 === 1 ? "md:order-2" : ""
                      }`}
                    >
                      <Image
                        src={project.image || projectImageById[project.id] || defaultProjectImage}
                        alt={`${project.title} project`}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-45" />
                    </div>

                    <div
                      className={`flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-10 ${
                        index % 2 === 1 ? "md:order-1" : ""
                      }`}
                    >
                      <p className="text-white/85 text-sm font-medium mb-2">{project.event}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{project.title}</h3>
                      <p className="text-white/90 mt-4 leading-relaxed">{project.description}</p>

                      <div className="mt-5">
                        <p className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                          <HiMapPin className="w-4 h-4" />
                          {project.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </a>
            ) : (
              <Link
                key={project.id}
                href={href}
                className="group block transition-all duration-300 hover:-translate-y-0.5"
              >
                <motion.article variants={rowItem} className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                  <div
                    className={`relative h-72 w-full overflow-hidden md:h-[360px] ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <Image
                      src={project.image || projectImageById[project.id] || defaultProjectImage}
                      alt={`${project.title} project`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-45" />
                  </div>

                  <div
                    className={`flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-10 ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <p className="text-white/85 text-sm font-medium mb-2">{project.event}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{project.title}</h3>
                    <p className="text-white/90 mt-4 leading-relaxed">{project.description}</p>

                    <div className="mt-5">
                      <p className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                        <HiMapPin className="w-4 h-4" />
                        {project.location}
                      </p>
                    </div>

                  </div>
                </div>
                </motion.article>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
