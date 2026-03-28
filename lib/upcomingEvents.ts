import type { Timestamp } from "firebase/firestore";

export type UpcomingEvent = {
  id: number;
  /** Firestore Timestamp (preferred) */
  startsAt?: Timestamp | { seconds: number };
  /** Legacy fields — optional if migrated to startsAt */
  day?: string;
  month?: string;
  year?: string;
  title: string;
  type: string;
  location: string;
  image?: string;
};
