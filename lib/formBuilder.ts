// ─── Form Builder types ────────────────────────────────────────────────────────

export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "number";

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  /** For "select" and "checkbox-group" types – list of option labels */
  options?: string[];
};

export type FormSection = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
};

export type EventForm = {
  id?: string;
  title: string;
  description?: string;
  /** Free-text reference to the linked event (title or Firestore doc id) */
  eventRef?: string;
  sections: FormSection[];
  /** @deprecated – old forms stored a flat fields array; use sections instead */
  fields?: FormField[];
  isPublished: boolean;
  createdAt?: number;
  updatedAt?: number;
};

export type FormSubmission = {
  id?: string;
  formId: string;
  /** Key = field.id, value = user's answer */
  data: Record<string, string | boolean | number | string[]>;
  confirmationCode?: string;
  submittedAt?: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Flatten all fields from all sections into a single array. */
export function getAllFields(sections: FormSection[]): FormField[] {
  return sections.flatMap((s) => s.fields);
}

/**
 * Convert an old-format form (flat `fields` array) to the new sections format.
 * Safe to call on already-migrated forms.
 */
export function normalizeSections(
  form: Pick<EventForm, "sections" | "fields">,
): FormSection[] {
  if (Array.isArray(form.sections) && form.sections.length > 0) {
    return form.sections;
  }
  if (Array.isArray(form.fields) && form.fields.length > 0) {
    return [{ id: "legacy", title: "Section 1", description: "", fields: form.fields }];
  }
  return [];
}

// ─── Shared validation ─────────────────────────────────────────────────────────

/**
 * Validate a submission payload against a form's field schema.
 * Returns an error string if invalid, or null if valid.
 */
export function validateSubmission(
  fields: FormField[],
  data: Record<string, unknown>,
): string | null {
  for (const field of fields) {
    const raw = data[field.id];

    if (field.type === "checkbox") {
      continue;
    }

    if (field.type === "checkbox-group") {
      if (field.required) {
        const arr = Array.isArray(raw) ? raw.filter(Boolean) : [];
        if (arr.length === 0) {
          return `"${field.label}" requires at least one selection.`;
        }
      }
      continue;
    }

    if (field.required) {
      if (raw === undefined || raw === null || raw === "") {
        return `"${field.label}" is required.`;
      }
    }

    if (raw !== undefined && raw !== null && raw !== "") {
      if (field.type === "email") {
        if (typeof raw !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
          return `"${field.label}" must be a valid email address.`;
        }
      }
      if (field.type === "number") {
        if (isNaN(Number(raw))) {
          return `"${field.label}" must be a number.`;
        }
      }
      if (field.type === "select" && field.options?.length) {
        if (!field.options.includes(String(raw))) {
          return `"${field.label}" contains an invalid selection.`;
        }
      }
    }
  }
  return null;
}
