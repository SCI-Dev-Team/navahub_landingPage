"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import { DATASET_CONFIG, DATASETS, LOCALES, type Dataset, type FieldConfig, type Locale } from "@/lib/dataAdmin";
import {
  createBilingualContentEntry,
  deleteContentEntry,
  fetchDatasetEntries,
  type AdminEntry,
  updateContentEntry,
} from "@/lib/contentApi";
import { toIsoDateInput } from "@/lib/datetime";

const PIN_SESSION_KEY = "navahub_pin_verified";

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  item?: Record<string, unknown>;
};

function defaultValues(fields: FieldConfig[]): Record<string, string | boolean> {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.key] = field.type === "boolean" ? false : "";
    return acc;
  }, {});
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [dataset, setDataset] = useState<Dataset>("projects");
  const [locale, setLocale] = useState<Locale>("en");
  const [entries, setEntries] = useState<AdminEntry[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [enDraftValues, setEnDraftValues] = useState<Record<string, string | boolean> | null>(null);
  const [kmDraftValues, setKmDraftValues] = useState<Record<string, string | boolean> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<ApiResponse | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminEntry | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    defaultValues(DATASET_CONFIG.projects),
  );

  const fields = useMemo(() => DATASET_CONFIG[dataset], [dataset]);
  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.docId === selectedDocId) ?? null,
    [entries, selectedDocId],
  );

  /* ── Auth guard ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (sessionStorage.getItem(PIN_SESSION_KEY) !== "true") {
      router.replace("/admin");
      return;
    }

    const unsubscribe = onAuthStateChanged(clientAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setChecking(false);
      } else {
        router.replace("/admin/login");
      }
    });
    return unsubscribe;
  }, [router]);

  /* ── Data helpers ───────────────────────────────────────────────────────── */
  function handleDatasetChange(next: Dataset) {
    setDataset(next);
    setSelectedDocId(null);
    setViewMode("list");
    setCreateStep(1);
    setEnDraftValues(null);
    setKmDraftValues(null);
    setFeedback(null);
  }

  function updateValue(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function valuesFromEntry(entry: AdminEntry, activeFields: FieldConfig[]) {
    return activeFields.reduce<Record<string, string | boolean>>((acc, field) => {
      if (field.key === "eventDate") {
        if (entry.values.startsAt != null) {
          acc[field.key] = toIsoDateInput(entry.values.startsAt);
          return acc;
        }
        const rawYear = entry.values.year;
        const rawMonth = entry.values.month;
        const rawDay = entry.values.day;
        if (typeof rawYear === "string" && typeof rawMonth === "string" && typeof rawDay === "string") {
          const monthIdx = new Date(`${rawMonth} 01, ${rawYear}`).getMonth() + 1;
          const normalizedMonth = String(monthIdx).padStart(2, "0");
          const normalizedDay = String(rawDay).padStart(2, "0");
          acc[field.key] = `${rawYear}-${normalizedMonth}-${normalizedDay}`;
        } else {
          acc[field.key] = "";
        }
        return acc;
      }
      const raw = entry.values[field.key];
      if (field.type === "date") {
        acc[field.key] = toIsoDateInput(raw);
      } else if (field.type === "boolean") {
        acc[field.key] = raw === true;
      } else if (field.type === "string-array") {
        acc[field.key] = Array.isArray(raw) ? raw.join(", ") : "";
      } else if (typeof raw === "number") {
        acc[field.key] = String(raw);
      } else {
        acc[field.key] = typeof raw === "string" ? raw : "";
      }
      return acc;
    }, {});
  }

  async function loadEntries(activeDataset: Dataset, activeLocale: Locale) {
    setLoading(true);
    try {
      const rows = await fetchDatasetEntries(activeDataset, activeLocale);
      setEntries(rows);
    } catch {
      setEntries([]);
      setFeedback({ error: "Failed to load data from Firestore." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries(dataset, locale);
    setValues(defaultValues(fields));
    setViewMode("list");
    setCreateStep(1);
    setEnDraftValues(null);
    setKmDraftValues(null);
  }, [dataset, locale, fields]);

  useEffect(() => {
    if (!selectedEntry) return;
    setValues(valuesFromEntry(selectedEntry, fields));
  }, [selectedEntry, fields]);

  function switchCreateStep(nextStep: 1 | 2) {
    if (selectedDocId) return;
    if (nextStep === 1) {
      setKmDraftValues(values);
      setValues(enDraftValues ?? defaultValues(fields));
      setCreateStep(1);
      return;
    }
    if (!enDraftValues) {
      setFeedback({ error: "Please complete English first before Khmer." });
      return;
    }
    setEnDraftValues(values);
    setValues(kmDraftValues ?? defaultValues(fields));
    setCreateStep(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      if (selectedDocId) {
        await updateContentEntry({ dataset, docId: selectedDocId, values });
        setFeedback({
          success: true,
          message:
            dataset === "upcomingEvents"
              ? "Upcoming event updated."
              : `Updated ${dataset} item #${selectedEntry?.id ?? ""}.`,
        });
      } else {
        if (createStep === 1) {
          setEnDraftValues(values);
          setValues(kmDraftValues ?? defaultValues(fields));
          setCreateStep(2);
          setFeedback({ success: true, message: "Step 1 (English) saved. Please complete Step 2 (Khmer)." });
          return;
        }
        if (!enDraftValues) throw new Error("English data is missing. Please start from Step 1.");
        const result = await createBilingualContentEntry({ dataset, enValues: enDraftValues, kmValues: values });
        setFeedback({
          success: true,
          message:
            dataset === "upcomingEvents"
              ? "Created bilingual upcoming events."
              : `Created bilingual ${dataset} item #${result.id}.`,
        });
      }
      await loadEntries(dataset, locale);
      setSelectedDocId(null);
      setValues(defaultValues(fields));
      setCreateStep(1);
      setEnDraftValues(null);
      setKmDraftValues(null);
      setViewMode("list");
    } catch (error) {
      setFeedback({ error: error instanceof Error ? error.message : "Request failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(docId: string) {
    setFeedback(null);
    try {
      await deleteContentEntry(dataset, docId);
      await loadEntries(dataset, locale);
      if (selectedDocId === docId) {
        setSelectedDocId(null);
        setValues(defaultValues(fields));
      }
      setFeedback({ success: true, message: "Record deleted." });
    } catch (error) {
      setFeedback({ error: error instanceof Error ? error.message : "Delete failed." });
    }
  }

  async function handleSignOut() {
    await signOut(clientAuth);
    sessionStorage.removeItem(PIN_SESSION_KEY);
    router.push("/admin");
  }

  /* ── Loading state ──────────────────────────────────────────────────────── */
  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#DA291C] border-t-transparent animate-spin" />
      </div>
    );
  }

  /* ── Dashboard UI ───────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto mb-6 w-full max-w-7xl rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DA291C]">NavaHub Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">Content Management</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="shrink-0 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Datasets</p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900">Choose Section</h2>
          <div className="mt-4 space-y-2">
            {DATASETS.map((item) => {
              const isActive = item === dataset;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleDatasetChange(item)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium capitalize transition ${
                    isActive
                      ? "border-[#DA291C] bg-[#DA291C] text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Current Dataset</p>
          <p className="mt-1 text-lg font-semibold capitalize text-neutral-900">{dataset}</p>
          <p className="mt-1 text-sm text-neutral-600">
            View, create, edit, and delete records for <code>{dataset}</code>.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-neutral-700">Locale</span>
              <select
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-[#DA291C]/20 transition focus:border-[#DA291C] focus:ring-2"
                value={locale}
                onChange={(event) => {
                  setLocale(event.target.value as Locale);
                  setSelectedDocId(null);
                  setViewMode("list");
                  setCreateStep(1);
                  setEnDraftValues(null);
                  setKmDraftValues(null);
                }}
              >
                {LOCALES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="flex items-end justify-start sm:justify-end">
              <div className="inline-flex rounded-xl border border-neutral-300 bg-white p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("form");
                    setSelectedDocId(null);
                    setValues(defaultValues(fields));
                    setCreateStep(1);
                    setEnDraftValues(null);
                    setKmDraftValues(null);
                    setFeedback(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    viewMode === "form" ? "bg-[#DA291C] text-white" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  Add New Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setSelectedDocId(null);
                    setValues(defaultValues(fields));
                    setCreateStep(1);
                    setEnDraftValues(null);
                    setKmDraftValues(null);
                    setFeedback(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    viewMode === "list" ? "bg-[#DA291C] text-white" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  Data List
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-neutral-500">
              {viewMode === "list"
                ? "Showing list view. Select a record to edit or delete."
                : "Showing add/edit form view."}
            </p>
          </div>

          {/* List view */}
          {viewMode === "list" ? (
            <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-neutral-800">Records</h3>
              <div className="mt-3 max-h-[620px] space-y-2 overflow-auto pr-1">
                {loading ? <p className="text-sm text-neutral-500">Loading...</p> : null}
                {!loading && entries.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-3 text-sm text-neutral-500">
                    No records found for this dataset and locale.
                  </p>
                ) : null}
                {entries.map((entry) => (
                  <div
                    key={entry.docId}
                    className={`rounded-xl border bg-white p-3 transition ${
                      selectedDocId === entry.docId
                        ? "border-[#DA291C]/60 shadow-[0_0_0_2px_rgba(218,41,28,0.08)]"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedDocId(entry.docId); setViewMode("form"); }}
                        className="text-left text-sm font-semibold text-neutral-900 transition hover:text-[#DA291C]"
                      >
                        {dataset === "upcomingEvents"
                          ? String(entry.values.title ?? entry.values.event ?? "Untitled")
                          : `#${entry.id} ${String(entry.values.title ?? entry.values.event ?? "Untitled")}`}
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => { setSelectedDocId(entry.docId); setViewMode("form"); }}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(entry)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Form view */
            <form className="mt-8 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5" onSubmit={handleSubmit}>
              <div className="mb-4 border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-semibold text-neutral-800">{selectedDocId ? "Edit Entry" : "Create Entry"}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {selectedDocId
                    ? "Selected record loaded in form."
                    : createStep === 1
                      ? "Step 1 of 2: Enter English content."
                      : "Step 2 of 2: Enter Khmer content."}
                </p>
              </div>
              {!selectedDocId ? (
                <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700">
                  {createStep === 1 ? "Current step: English" : "Current step: Khmer"}
                </div>
              ) : null}
              {!selectedDocId ? (
                <div className="mb-4 inline-flex rounded-xl border border-neutral-300 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => switchCreateStep(1)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      createStep === 1 ? "bg-[#DA291C] text-white" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => switchCreateStep(2)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      createStep === 2 ? "bg-[#DA291C] text-white" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    Khmer
                  </button>
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.key} className="space-y-1.5">
                    <span className="text-sm font-medium text-neutral-700">{field.label}</span>
                    {field.type === "boolean" ? (
                      <div className="flex h-[42px] items-center rounded-xl border border-neutral-300 bg-white px-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border border-neutral-300 accent-[#DA291C]"
                          checked={Boolean(values[field.key])}
                          onChange={(event) => updateValue(field.key, event.target.checked)}
                        />
                      </div>
                    ) : field.key === "description" ? (
                      <textarea
                        required={field.required}
                        value={String(values[field.key] ?? "")}
                        placeholder={field.placeholder}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        rows={5}
                        className="w-full resize-y rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-[#DA291C]/20 transition focus:border-[#DA291C] focus:ring-2"
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        required={field.required}
                        value={String(values[field.key] ?? "")}
                        placeholder={field.placeholder}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-[#DA291C]/20 transition focus:border-[#DA291C] focus:ring-2"
                      />
                    )}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 rounded-xl bg-[#DA291C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A51414] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : selectedDocId
                    ? "Update Entry"
                    : createStep === 1
                      ? "Continue to Khmer"
                      : "Submit"}
              </button>
            </form>
          )}

          {feedback?.error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback.error}
            </div>
          ) : null}
          {feedback?.success ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback.message}
            </div>
          ) : null}
        </section>
      </div>

      {/* Delete confirm modal */}
      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-neutral-900">
                {dataset === "upcomingEvents"
                  ? String(pendingDelete.values.title ?? pendingDelete.values.event ?? "this record")
                  : `#${pendingDelete.id} ${String(pendingDelete.values.title ?? pendingDelete.values.event ?? "this record")}`}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const docId = pendingDelete.docId;
                  setPendingDelete(null);
                  void handleDelete(docId);
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
