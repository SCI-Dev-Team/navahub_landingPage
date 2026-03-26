import type { Locale } from "@/lib/i18n";
import projectsEn from "@/lib/data/projects.en.json";
import projectsKm from "@/lib/data/projects.km.json";

export type Project = {
  id: number;
  title: string;
  event: string;
  team: string;
  members: number;
  location: string;
  isOnline: boolean;
  date: string;
  tags: string[];
  description: string;
  impact: string;
  emoji: string;
};

const byLocale: Record<Locale, Project[]> = {
  en: projectsEn as Project[],
  km: projectsKm as Project[],
};

export function getProjects(locale: Locale): Project[] {
  return byLocale[locale] ?? byLocale.en;
}

export function getProjectById(id: number, locale: Locale): Project | undefined {
  return getProjects(locale).find((p) => p.id === id);
}

export function getAllProjectIds(): number[] {
  return projectsEn.map((p) => p.id);
}
