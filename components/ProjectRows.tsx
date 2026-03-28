"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiMapPin, HiArrowRight, HiArrowPath } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";
import { fetchContent } from "@/lib/contentApi";
import type { Project } from "@/lib/projects";

function ImageWithFallback({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="h-full w-full bg-[#F3F2EE] flex items-center justify-center">
        <span className="text-5xl opacity-20">🖼️</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      loading={index === 0 ? "eager" : "lazy"}
      priority={index === 0}
      onError={() => setErrored(true)}
    />
  );
}

function ProjectSkeleton() {
  return (
    <div className="border-b border-gray-100 overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-2">
        <div className="h-72 md:h-[380px] bg-gray-100" />
        <div className="flex flex-col justify-center px-6 sm:px-10 py-10 gap-4">
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
          <div className="h-8 w-3/4 bg-gray-100 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectRows() {
  const { locale, t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetchContent(locale)
      .then((data) => {
        if (!isMounted) return;
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects([]);
        setLoading(false);
        setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <section id="projects" className="mt-5 py-20 px-4 sm:px-6 lg:px-8 bg-[#DA291C]">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="w-12 h-1 bg-white mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">
            {t("projects.heading")}
          </h2>
          <p className="text-red-100">{t("projects.subtitle")}</p>
        </motion.div>

        <div className="border-t border-red-400">
          {/* Loading skeletons */}
          {loading && (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <HiArrowPath className="w-8 h-8 text-red-200" />
              <p className="text-red-100 text-sm">Failed to load projects. Please refresh the page.</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <p className="text-red-100 text-sm">No projects available yet.</p>
            </div>
          )}

          {/* Project cards — each animates on its own whileInView to avoid parent-stagger race condition */}
          {!loading && projects.map((project, index) => {
            const externalLink = typeof project.externalLink === "string" ? project.externalLink.trim() : "";
            const imageSrc = typeof project.image === "string" ? project.image.trim() : "";
            const isOdd = index % 2 === 1;

            const content = (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`overflow-hidden border-b border-red-400 ${isOdd ? "bg-white" : "bg-white"}`}
              >
                <div className="grid md:grid-cols-2">
                  <div
                    className={`relative h-72 w-full overflow-hidden md:h-[380px] ${isOdd ? "md:order-2" : ""}`}
                  >
                    {imageSrc ? (
                      <ImageWithFallback
                        src={imageSrc}
                        alt={`${project.title} project`}
                        index={index}
                      />
                    ) : (
                      <div className="h-full w-full bg-[#F3F2EE] flex items-center justify-center">
                        <span className="text-5xl opacity-20">🖼️</span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-col justify-center px-6 sm:px-10 py-10 ${isOdd ? "md:order-1" : ""}`}
                  >
                    <span className="inline-block text-[#DA291C] bg-red-50 border border-red-100 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-4">
                      {project.event}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#222221] leading-tight mb-4">
                      {project.title}
                    </h3>

                    <p className="text-[#4A4F53] leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <p className="inline-flex items-center gap-1.5 text-[#4A4F53]/70 text-sm">
                        <HiMapPin className="w-4 h-4 shrink-0 text-[#DA291C]" />
                        {project.location}
                      </p>

                      {externalLink && (
                        <span className="ml-auto inline-flex items-center gap-1.5 text-[#DA291C] font-semibold text-sm group-hover:gap-2.5 transition-all">
                          {t("projects.viewProject")}
                          <HiArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );

            return externalLink ? (
              <a
                key={project.id}
                href={externalLink}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                {content}
              </a>
            ) : (
              <div key={project.id} className="group">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
