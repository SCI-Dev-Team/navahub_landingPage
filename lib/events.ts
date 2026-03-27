import type { Timestamp } from "firebase/firestore";

export type EventAnnouncement = {
  id: number;
  title: string;
  description: string;
  image: string;
  /** Firestore Timestamp (preferred); legacy string still supported in UI */
  date?: Timestamp | string;
  location: string;
  ctaLabel: string;
  ctaHref: string;
};
