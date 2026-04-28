"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import type { EventForm, FormField, FormFieldType, FormSection, FormSubmission } from "@/lib/formBuilder";
import { normalizeSections, getAllFields } from "@/lib/formBuilder";

const PIN_SESSION_KEY = "navahub_pin_verified";

const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  text: "Short Text",
  email: "Email",
  phone: "Phone",
  textarea: "Long Text",
  select: "Dropdown",
  checkbox: "Checkbox (Yes/No)",
  "checkbox-group": "Checkboxes (Multi-select)",
  number: "Number",
};

const EMPTY_FIELD = (): FormField => ({
  id: crypto.randomUUID(),
  type: "text",
  label: "",
  placeholder: "",
  required: false,
  options: [],
});

const EMPTY_SECTION = (index: number = 1): FormSection => ({
  id: crypto.randomUUID(),
  title: `Section ${index}`,
  description: "",
  fields: [],
});

const EMPTY_FORM = (): Omit<EventForm, "id"> => ({
  title: "",
  description: "",
  eventRef: "",
  sections: [EMPTY_SECTION(1)],
  isPublished: false,
});

// ─── API helpers (attach auth token) ─────────────────────────────────────────

async function authHeaders(user: User): Promise<HeadersInit> {
  const token = await user.getIdToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function apiFetch(user: User, input: string, init?: RequestInit) {
  const headers = await authHeaders(user);
  const res = await fetch(input, { ...init, headers: { ...headers, ...(init?.headers ?? {}) } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed.");
  return json;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldEditor({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: FormField;
  index: number;
  total: number;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  function set<K extends keyof FormField>(key: K, value: FormField[K]) {
    onChange({ ...field, [key]: value });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DA291C] text-[11px] font-bold text-white flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-neutral-700 flex-1">{field.label || "Untitled field"}</span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            title="Move up"
            disabled={index === 0}
            onClick={onMoveUp}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
          >
            ▲
          </button>
          <button
            type="button"
            title="Move down"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
          >
            ▼
          </button>
          <button
            type="button"
            title="Delete field"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Type */}
        <label className="space-y-1">
          <span className="text-xs font-medium text-neutral-600">Field Type</span>
          <select
            value={field.type}
            onChange={(e) => set("type", e.target.value as FormFieldType)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
          >
            {(Object.keys(FIELD_TYPE_LABELS) as FormFieldType[]).map((t) => (
              <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </label>

        {/* Label */}
        <label className="space-y-1">
          <span className="text-xs font-medium text-neutral-600">Label <span className="text-red-500">*</span></span>
          <input
            type="text"
            value={field.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="e.g. Full Name"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
          />
        </label>

        {/* Placeholder (not for checkbox/select/checkbox-group) */}
        {field.type !== "checkbox" && field.type !== "select" && field.type !== "checkbox-group" && (
          <label className="space-y-1">
            <span className="text-xs font-medium text-neutral-600">Placeholder</span>
            <input
              type="text"
              value={field.placeholder ?? ""}
              onChange={(e) => set("placeholder", e.target.value)}
              placeholder="Optional hint text"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            />
          </label>
        )}

        {/* Checkbox label */}
        {field.type === "checkbox" && (
          <label className="space-y-1">
            <span className="text-xs font-medium text-neutral-600">Checkbox Label</span>
            <input
              type="text"
              value={field.placeholder ?? ""}
              onChange={(e) => set("placeholder", e.target.value)}
              placeholder="e.g. I agree to the terms"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            />
          </label>
        )}

        {/* Required toggle */}
        <div className="flex items-center gap-2 pt-5">
          <input
            id={`req-${field.id}`}
            type="checkbox"
            checked={field.required}
            onChange={(e) => set("required", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 accent-[#DA291C]"
          />
          <label htmlFor={`req-${field.id}`} className="text-sm font-medium text-neutral-700 cursor-pointer">
            Required
          </label>
        </div>
      </div>

      {/* Options for select / checkbox-group */}
      {(field.type === "select" || field.type === "checkbox-group") && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">Options</span>
            <button
              type="button"
              onClick={() => set("options", [...(field.options ?? []), ""])}
              className="flex items-center gap-1 rounded-lg border border-[#DA291C] px-2.5 py-1 text-xs font-semibold text-[#DA291C] hover:bg-[#DA291C] hover:text-white transition"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Add Option
            </button>
          </div>
          {(field.options ?? []).length === 0 && (
            <p className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-neutral-400">
              No options yet. Click <strong>Add Option</strong> to start.
            </p>
          )}
          <div className="space-y-2">
            {(field.options ?? []).map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">
                  {optIdx + 1}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...(field.options ?? [])];
                    next[optIdx] = e.target.value;
                    set("options", next);
                  }}
                  placeholder={`Option ${optIdx + 1}`}
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (field.options ?? []).filter((_, i) => i !== optIdx);
                    set("options", next);
                  }}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition"
                  title="Remove option"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Submissions modal ────────────────────────────────────────────────────────

function SubmissionsModal({
  form,
  user,
  onClose,
}: {
  form: EventForm;
  user: User;
  onClose: () => void;
}) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(user, `/api/admin/forms/${form.id}/submissions`)
      .then((data: { submissions: FormSubmission[] }) => setSubmissions(data.submissions))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [form.id, user]);

  const fieldMap = Object.fromEntries(
    getAllFields(normalizeSections({ sections: form.sections ?? [], fields: form.fields })).map((f) => [f.id, f.label])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Submissions</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{form.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 p-6">
          {loading && <p className="text-sm text-neutral-500">Loading submissions…</p>}
          {!loading && error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && submissions.length === 0 && (
            <p className="text-sm text-neutral-500">No submissions yet.</p>
          )}
          {!loading && !error && submissions.length > 0 && (
            <div className="space-y-4">
              {submissions.map((sub, i) => (
                <div key={sub.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500">
                      #{submissions.length - i} &nbsp;·&nbsp;{" "}
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : "—"}
                    </span>
                    {sub.confirmationCode && (
                      <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-neutral-600">
                        🎫 {sub.confirmationCode}
                      </span>
                    )}
                  </div>
                  <dl className="grid gap-1.5 sm:grid-cols-2">
                    {Object.entries(sub.data ?? {}).map(([fieldId, val]) => (
                      <div key={fieldId}>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                          {fieldMap[fieldId] ?? fieldId}
                        </dt>
                        <dd className="text-sm text-neutral-800 break-words">
                          {Array.isArray(val)
                            ? val.join(", ") || "—"
                            : val === true ? "Yes" : val === false ? "No" : String(val || "—")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminFormsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [forms, setForms] = useState<EventForm[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);

  // editor state
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<EventForm, "id">>(EMPTY_FORM());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok?: boolean; msg: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventForm | null>(null);
  const [viewSubmissionsFor, setViewSubmissionsFor] = useState<EventForm | null>(null);

  /* ── Auth guard ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (sessionStorage.getItem(PIN_SESSION_KEY) !== "true") {
      router.replace("/admin");
      return;
    }
    const unsub = onAuthStateChanged(clientAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setChecking(false);
      } else {
        router.replace("/admin/login");
      }
    });
    return unsub;
  }, [router]);

  /* ── Load forms ──────────────────────────────────────────────────────────── */
  const loadForms = useCallback(
    async (activeUser: User) => {
      setLoadingForms(true);
      try {
        const data = await apiFetch(activeUser, "/api/admin/forms");
        setForms(data.forms ?? []);
      } catch (e) {
        setFeedback({ msg: (e as Error).message });
      } finally {
        setLoadingForms(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (user) void loadForms(user);
  }, [user, loadForms]);

  /* ── Editor helpers ──────────────────────────────────────────────────────── */
  function selectForm(form: EventForm) {
    setSelectedFormId(form.id ?? null);
    setDraft({
      title: form.title,
      description: form.description ?? "",
      eventRef: form.eventRef ?? "",
      sections: normalizeSections({ sections: form.sections ?? [], fields: form.fields }),
      isPublished: form.isPublished,
    });
    setStep(1);
    setFeedback(null);
  }

  function newForm() {
    setSelectedFormId(null);
    setDraft(EMPTY_FORM());
    setStep(1);
    setFeedback(null);
  }

  // ── Section helpers ─────────────────────────────────────────────────────────
  function addSection() {
    setDraft((p) => ({ ...p, sections: [...p.sections, EMPTY_SECTION(p.sections.length + 1)] }));
  }

  function deleteSection(si: number) {
    setDraft((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== si) }));
  }

  function updateSectionMeta(si: number, updates: Partial<Pick<FormSection, "title" | "description">>) {
    setDraft((p) => {
      const sections = [...p.sections];
      sections[si] = { ...sections[si], ...updates };
      return { ...p, sections };
    });
  }

  function moveSection(si: number, dir: -1 | 1) {
    setDraft((p) => {
      const sections = [...p.sections];
      const target = si + dir;
      if (target < 0 || target >= sections.length) return p;
      [sections[si], sections[target]] = [sections[target], sections[si]];
      return { ...p, sections };
    });
  }

  // ── Field helpers (section-aware) ───────────────────────────────────────────
  function addField(si: number) {
    setDraft((p) => {
      const sections = [...p.sections];
      sections[si] = { ...sections[si], fields: [...sections[si].fields, EMPTY_FIELD()] };
      return { ...p, sections };
    });
  }

  function deleteField(si: number, fi: number) {
    setDraft((p) => {
      const sections = [...p.sections];
      sections[si] = { ...sections[si], fields: sections[si].fields.filter((_, i) => i !== fi) };
      return { ...p, sections };
    });
  }

  function updateField(si: number, fi: number, updated: FormField) {
    setDraft((p) => {
      const sections = [...p.sections];
      const fields = [...sections[si].fields];
      fields[fi] = updated;
      sections[si] = { ...sections[si], fields };
      return { ...p, sections };
    });
  }

  function moveField(si: number, fi: number, dir: -1 | 1) {
    setDraft((p) => {
      const sections = [...p.sections];
      const fields = [...sections[si].fields];
      const target = fi + dir;
      if (target < 0 || target >= fields.length) return p;
      [fields[fi], fields[target]] = [fields[target], fields[fi]];
      sections[si] = { ...sections[si], fields };
      return { ...p, sections };
    });
  }

  const totalFields = draft.sections.reduce((sum, s) => sum + s.fields.length, 0);

  async function handleSave() {
    if (!user) return;
    if (!draft.title.trim()) {
      setFeedback({ msg: "Form title is required." });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      if (selectedFormId) {
        await apiFetch(user, `/api/admin/forms/${selectedFormId}`, {
          method: "PUT",
          body: JSON.stringify(draft),
        });
        setFeedback({ ok: true, msg: "Form saved." });
      } else {
        const created = await apiFetch(user, "/api/admin/forms", {
          method: "POST",
          body: JSON.stringify(draft),
        });
        setSelectedFormId(created.id);
        setFeedback({ ok: true, msg: "Form created." });
      }
      await loadForms(user);
    } catch (e) {
      setFeedback({ msg: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }

  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleTogglePublish(form: EventForm, e: React.MouseEvent) {
    e.stopPropagation();
    if (!user || !form.id) return;
    setTogglingId(form.id);
    try {
      const updated = { ...form, isPublished: !form.isPublished };
      await apiFetch(user, `/api/admin/forms/${form.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      // Sync draft if this form is currently open
      if (selectedFormId === form.id) {
        setDraft((p) => ({ ...p, isPublished: !form.isPublished }));
      }
      await loadForms(user);
    } catch (e) {
      setFeedback({ msg: (e as Error).message });
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!user || !pendingDelete?.id) return;
    try {
      await apiFetch(user, `/api/admin/forms/${pendingDelete.id}`, { method: "DELETE" });
      setPendingDelete(null);
      newForm();
      await loadForms(user);
      setFeedback({ ok: true, msg: "Form deleted." });
    } catch (e) {
      setFeedback({ msg: (e as Error).message });
      setPendingDelete(null);
    }
  }

  const shareUrl =
    selectedFormId && draft.isPublished
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/register/${selectedFormId}`
      : null;

  /* ── Render ──────────────────────────────────────────────────────────────── */
  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#DA291C] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            ← Dashboard
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Registration Form Builder</h1>
            <p className="text-sm text-neutral-500">Create and manage event registration forms</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[260px_1fr]">
            {/* ── Sidebar: form list ── */}
            <aside className="border-b border-neutral-200 lg:border-b-0 lg:border-r flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Forms</p>
                <button
                  type="button"
                  onClick={newForm}
                  className="rounded-lg bg-[#DA291C] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b8211a] transition"
                >
                  + New
                </button>
              </div>
              <div className="flex-1 overflow-auto px-3 pb-4 space-y-1.5 max-h-[65vh]">
                {loadingForms && (
                  <p className="text-xs text-neutral-500 px-2">Loading…</p>
                )}
                {!loadingForms && forms.length === 0 && (
                  <p className="text-xs text-neutral-400 px-2">No forms yet. Create one →</p>
                )}
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className={`rounded-xl border transition ${
                      selectedFormId === form.id
                        ? "border-[#DA291C] bg-[#DA291C]/5 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectForm(form)}
                      className="w-full px-3 pt-2.5 pb-1.5 text-left"
                    >
                      <p className={`text-sm font-medium truncate ${selectedFormId === form.id ? "text-[#DA291C]" : "text-neutral-800"}`}>
                        {form.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            form.isPublished ? "bg-green-500" : "bg-neutral-300"
                          }`}
                        />
                        <p className="text-[11px] text-neutral-400">
                          {form.isPublished ? "Published" : "Draft"} · {form.sections?.reduce((n, s) => n + s.fields.length, 0) ?? (form.fields?.length ?? 0)} fields
                        </p>
                      </div>
                    </button>
                    <div className="px-3 pb-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublish(form, e)}
                        disabled={togglingId === form.id}
                        className={`w-full rounded-lg py-1 text-[11px] font-semibold transition disabled:opacity-50 ${
                          form.isPublished
                            ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600"
                            : "bg-neutral-100 text-neutral-500 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {togglingId === form.id ? "…" : form.isPublished ? "✓ Published — click to unpublish" : "Unpublished — click to publish"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* ── Main: form editor ── */}
            <section className="flex flex-col overflow-hidden">
              {/* ── Step tabs ── */}
              <div className="flex border-b border-neutral-200 bg-neutral-50">
                {([
                  { n: 1, label: "Settings" },
                  { n: 2, label: "Sections & Fields" },
                  { n: 3, label: "Review & Save" },
                ] as { n: 1 | 2 | 3; label: string }[]).map(({ n, label }) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setStep(n); setFeedback(null); }}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2 -mb-px ${
                      step === n
                        ? "border-[#DA291C] text-[#DA291C] bg-white"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        step === n ? "bg-[#DA291C] text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {n}
                    </span>
                    {label}
                    {n === 2 && totalFields > 0 && (
                      <span className="ml-1 rounded-full bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                        {totalFields}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Feedback ── */}
              <div className="px-6 sm:px-8 pt-5">
                {feedback && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      feedback.ok
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {feedback.msg}
                  </div>
                )}
              </div>

              {/* ── Step 1: Settings ── */}
              {step === 1 && (
                <div className="flex-1 overflow-auto px-6 sm:px-8 py-6">
                  <h2 className="text-sm font-semibold text-neutral-800 mb-4">Form Settings</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2 space-y-1">
                      <span className="text-sm font-medium text-neutral-700">
                        Form Title <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Navathon 2026 Registration"
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
                      />
                    </label>

                    <label className="sm:col-span-2 space-y-1">
                      <span className="text-sm font-medium text-neutral-700">Description</span>
                      <textarea
                        rows={3}
                        value={draft.description}
                        onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Short description shown to registrants…"
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20 resize-none"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-sm font-medium text-neutral-700">Linked Event</span>
                      <input
                        type="text"
                        value={draft.eventRef}
                        onChange={(e) => setDraft((p) => ({ ...p, eventRef: e.target.value }))}
                        placeholder="Event title or ID (optional)"
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
                      />
                    </label>

                    <div className="flex items-center gap-3 pt-5">
                      <input
                        id="isPublished"
                        type="checkbox"
                        checked={draft.isPublished}
                        onChange={(e) => setDraft((p) => ({ ...p, isPublished: e.target.checked }))}
                        className="h-4 w-4 rounded border-neutral-300 accent-[#DA291C]"
                      />
                      <label htmlFor="isPublished" className="text-sm font-medium text-neutral-700 cursor-pointer">
                        Published (visible to the public)
                      </label>
                    </div>
                  </div>

                  {/* Step nav */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!draft.title.trim()) {
                          setFeedback({ msg: "Form title is required before continuing." });
                          return;
                        }
                        setFeedback(null);
                        setStep(2);
                      }}
                      className="rounded-xl bg-[#DA291C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b8211a] transition"
                    >
                      Next: Sections &amp; Fields →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Sections & Fields ── */}
              {step === 2 && (
                <div className="flex-1 overflow-auto px-6 sm:px-8 py-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-neutral-800">
                      Sections
                      <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                        {draft.sections.length}
                      </span>
                    </h2>
                    <button
                      type="button"
                      onClick={addSection}
                      className="flex items-center gap-1.5 rounded-xl border border-[#DA291C] px-3 py-1.5 text-xs font-semibold text-[#DA291C] hover:bg-[#DA291C] hover:text-white transition"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-6">
                    {draft.sections.map((section, si) => (
                      <div key={section.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden">
                        {/* Section header bar */}
                        <div className="flex items-center gap-3 bg-white px-4 py-3 border-b border-neutral-200">
                          <div className="flex items-center gap-0.5">
                            <button type="button" disabled={si === 0} onClick={() => moveSection(si, -1)}
                              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30" title="Move section up">▲</button>
                            <button type="button" disabled={si === draft.sections.length - 1} onClick={() => moveSection(si, 1)}
                              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30" title="Move section down">▼</button>
                          </div>
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#DA291C] text-[11px] font-bold text-white">
                            {si + 1}
                          </span>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionMeta(si, { title: e.target.value })}
                            placeholder="Section title"
                            className="flex-1 bg-transparent text-sm font-semibold text-neutral-800 outline-none border-b border-transparent focus:border-[#DA291C] pb-0.5 transition"
                          />
                          {draft.sections.length > 1 && (
                            <button type="button" onClick={() => deleteSection(si)}
                              className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition">
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Section description */}
                        <div className="px-4 pt-3 pb-1">
                          <input
                            type="text"
                            value={section.description ?? ""}
                            onChange={(e) => updateSectionMeta(si, { description: e.target.value })}
                            placeholder="Section description (optional)"
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 outline-none focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
                          />
                        </div>

                        {/* Fields inside section */}
                        <div className="px-4 py-3 space-y-3">
                          {section.fields.length === 0 && (
                            <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-6 text-center">
                              <p className="text-xs text-neutral-400">No fields yet. Click <strong>+ Add Field</strong> below.</p>
                            </div>
                          )}
                          {section.fields.map((field, fi) => (
                            <FieldEditor
                              key={field.id}
                              field={field}
                              index={fi}
                              total={section.fields.length}
                              onChange={(updated) => updateField(si, fi, updated)}
                              onDelete={() => deleteField(si, fi)}
                              onMoveUp={() => moveField(si, fi, -1)}
                              onMoveDown={() => moveField(si, fi, 1)}
                            />
                          ))}
                        </div>

                        {/* Add field button */}
                        <div className="px-4 pb-4">
                          <button
                            type="button"
                            onClick={() => addField(si)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 bg-white py-2.5 text-xs font-semibold text-neutral-500 hover:border-[#DA291C] hover:text-[#DA291C] transition"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            Add Field to &quot;{section.title || `Section ${si + 1}`}&quot;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step nav */}
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { setFeedback(null); setStep(1); }}
                      className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFeedback(null); setStep(3); }}
                      className="rounded-xl bg-[#DA291C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b8211a] transition"
                    >
                      Next: Review &amp; Save →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Review & Save ── */}
              {step === 3 && (
                <div className="flex-1 overflow-auto px-6 sm:px-8 py-6">
                  <h2 className="text-sm font-semibold text-neutral-800 mb-4">Review & Save</h2>

                  {/* Summary card */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3 mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-bold text-neutral-900">{draft.title || <span className="text-neutral-400 font-normal italic">No title</span>}</p>
                        {draft.description && (
                          <p className="mt-0.5 text-sm text-neutral-500">{draft.description}</p>
                        )}
                        {draft.eventRef && (
                          <p className="mt-0.5 text-xs text-neutral-400">Event: {draft.eventRef}</p>
                        )}
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          draft.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {draft.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="border-t border-neutral-200 pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                        Sections &amp; Fields
                      </p>
                      {draft.sections.length === 0 ? (
                        <p className="text-sm text-neutral-400 italic">No sections added.</p>
                      ) : (
                        <div className="space-y-4">
                          {draft.sections.map((section, si) => (
                            <div key={section.id}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#DA291C] text-[10px] font-bold text-white">{si + 1}</span>
                                <p className="text-xs font-semibold text-neutral-700">{section.title || `Section ${si + 1}`}</p>
                                {section.description && <p className="text-[11px] text-neutral-400">— {section.description}</p>}
                              </div>
                              {section.fields.length === 0 ? (
                                <p className="ml-7 text-xs text-neutral-400 italic">No fields.</p>
                              ) : (
                                <ul className="ml-7 space-y-1">
                                  {section.fields.map((f, fi) => (
                                    <li key={f.id} className="flex items-center gap-2 text-sm text-neutral-700">
                                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[9px] font-bold text-neutral-500">{fi + 1}</span>
                                      <span className="font-medium">{f.label || <span className="italic text-neutral-400">Untitled</span>}</span>
                                      <span className="text-[11px] text-neutral-400">({FIELD_TYPE_LABELS[f.type]})</span>
                                      {f.required && <span className="text-[10px] font-semibold text-red-500">required</span>}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share link (if published + already saved) */}
                  {shareUrl && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                      <span className="text-xs font-semibold text-green-700">Share link:</span>
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-700 underline truncate"
                      >
                        {shareUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                        className="ml-auto rounded-lg border border-green-300 bg-white px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setFeedback(null); setStep(2); }}
                      className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-[#DA291C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b8211a] disabled:opacity-60 transition"
                    >
                      {saving ? "Saving…" : selectedFormId ? "Save Changes" : "Create Form"}
                    </button>
                    {selectedFormId && (() => {
                      const currentForm = forms.find((f) => f.id === selectedFormId);
                      return currentForm ? (
                        <button
                          type="button"
                          onClick={(e) => handleTogglePublish(currentForm, e)}
                          disabled={togglingId === selectedFormId}
                          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                            currentForm.isPublished
                              ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                              : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {togglingId === selectedFormId ? "…" : currentForm.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      ) : null;
                    })()}
                    {selectedFormId && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const form = forms.find((f) => f.id === selectedFormId);
                            if (form) setViewSubmissionsFor(form);
                          }}
                          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          View Submissions
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(forms.find((f) => f.id === selectedFormId) ?? null)}
                          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition ml-auto"
                        >
                          Delete Form
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ── Delete confirm dialog ── */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900">Delete form?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              <strong>{pendingDelete.title}</strong> and all its submissions will be permanently removed.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-xl border border-neutral-300 bg-white py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submissions modal ── */}
      {viewSubmissionsFor && user && (
        <SubmissionsModal
          form={viewSubmissionsFor}
          user={user}
          onClose={() => setViewSubmissionsFor(null)}
        />
      )}
    </main>
  );
}
