export type Locale = "en" | "km";
export type Dataset = "projects" | "events" | "upcomingEvents";
export type FieldType = "text" | "number" | "boolean" | "string-array" | "date";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
};

export const DATASET_CONFIG: Record<Dataset, FieldConfig[]> = {
  projects: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "event", label: "Event", type: "text", required: true },
    { key: "team", label: "Team", type: "text", required: true },
    { key: "members", label: "Members", type: "number", required: true },
    { key: "location", label: "Location", type: "text", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    {
      key: "tags",
      label: "Tags (comma-separated)",
      type: "string-array",
      required: true,
      placeholder: "IoT, Water, Next.js",
    },
    { key: "image", label: "Image URL", type: "text", required: true },
    {
      key: "externalLink",
      label: "External Link",
      type: "text",
      required: false,
      placeholder: "https://example.com/project",
    },
    { key: "description", label: "Description", type: "text", required: true },
    { key: "impact", label: "Impact", type: "text", required: true },
  ],
  events: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "description", label: "Description", type: "text", required: true },
    { key: "image", label: "Image URL", type: "text", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "location", label: "Location", type: "text", required: true },
    { key: "ctaLabel", label: "CTA Label", type: "text", required: true },
    { key: "ctaHref", label: "CTA Href", type: "text", required: true, placeholder: "#contact" },
  ],
  upcomingEvents: [
    { key: "eventDate", label: "Event Date", type: "date", required: true },
    { key: "title", label: "Title", type: "text", required: true },
    { key: "type", label: "Type", type: "text", required: true, placeholder: "Navathon" },
    { key: "location", label: "Location", type: "text", required: true },
  ],
};

export const DATASETS: Dataset[] = ["projects", "events", "upcomingEvents"];
export const LOCALES: Locale[] = ["en", "km"];
