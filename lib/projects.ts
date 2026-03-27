import type { Timestamp } from "firebase/firestore";

export type Project = {
  id: number;
  title: string;
  event: string;
  team: string;
  members: number;
  location: string;
  isOnline?: boolean;
  /** Firestore Timestamp (preferred); legacy string still supported in UI */
  date?: Timestamp | string;
  tags: string[];
  description: string;
  impact: string;
  emoji: string;
  image?: string;
  externalLink?: string;
};
