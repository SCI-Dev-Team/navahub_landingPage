"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { HiMapPin } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";
import { getProjects } from "@/lib/projects";

const projectImageById: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  2: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  3: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
  4: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  5: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
  6: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
};

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
  const projects = getProjects(locale);

  return (
    <section id="projects" className="mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-[#CC0000]">
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
          className="space-y-4"
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/80"
            >
              <motion.article variants={rowItem} className="p-5 sm:p-6 bg-white">
                <div className="mt-5 grid gap-5 md:grid-cols-[320px_1fr] md:gap-6">
                  <div className="relative h-56 w-full overflow-hidden md:h-full md:min-h-[260px]">
                    <Image
                      src={projectImageById[project.id]}
                      alt={`${project.title} project`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/5 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#CC0000]">{project.title}</h3>
                    <p className="text-sm text-[#CC0000] font-medium mt-1">{project.event}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{project.description}</p>

                    <div className="mt-4 pt-4">
                      <p className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <HiMapPin className="w-4 h-4" />
                        {project.location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
