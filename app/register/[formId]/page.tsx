"use client";

import { use, useEffect, useState } from "react";
import type { EventForm, FormField } from "@/lib/formBuilder";
import { normalizeSections, getAllFields } from "@/lib/formBuilder";

type FieldAnswer = string | boolean | number | string[];

function FormInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: FieldAnswer;
  onChange: (val: FieldAnswer) => void;
}) {
  const base =
    "w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={4}
          value={String(value)}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base + " resize-y"}
        />
      );
    case "select":
      return (
        <select
          value={String(value)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">-- Select an option --</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case "checkbox-group":
      return (
        <div className="space-y-2">
          {(field.options ?? []).map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${field.id}-${opt}`}
                checked={Array.isArray(value) && (value as string[]).includes(opt)}
                onChange={(e) => {
                  const current = Array.isArray(value) ? (value as string[]) : [];
                  onChange(
                    e.target.checked
                      ? [...current, opt]
                      : current.filter((o) => o !== opt)
                  );
                }}
                className="h-4 w-4 rounded border-neutral-300 accent-[#DA291C]"
              />
              <label htmlFor={`${field.id}-${opt}`} className="text-sm text-neutral-700 cursor-pointer">{opt}</label>
            </div>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2 pt-1">
          <input
            id={`field-${field.id}`}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 accent-[#DA291C]"
          />
          <label htmlFor={`field-${field.id}`} className="text-sm text-neutral-700 cursor-pointer">
            {field.placeholder || "Yes"}
          </label>
        </div>
      );
    case "number":
      return (
        <input
          type="number"
          value={String(value)}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
    case "email":
      return (
        <input
          type="email"
          value={String(value)}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
    case "phone":
      return (
        <input
          type="tel"
          value={String(value)}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
    default:
      return (
        <input
          type="text"
          value={String(value)}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
  }
}

function defaultAnswer(field: FormField): FieldAnswer {
  if (field.type === "checkbox") return false;
  if (field.type === "checkbox-group") return [];
  if (field.type === "number") return "";
  return "";
}

export default function RegisterPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);

  const [form, setForm] = useState<EventForm | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "not-found" | "closed" | "ready">("loading");
  const [sections, setSections] = useState<ReturnType<typeof normalizeSections>>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionError, setSectionError] = useState("");

  const [answers, setAnswers] = useState<Record<string, FieldAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState<{ code: string; qrDataUrl: string } | null>(null);

  /* ── Fetch form schema from public API ─────────────────────────────────── */
  useEffect(() => {
    fetch(`/api/register/${formId}/schema`)
      .then(async (res) => {
        if (res.status === 404) { setLoadState("not-found"); return; }
        if (res.status === 403) { setLoadState("closed"); return; }
        if (!res.ok) { setLoadState("not-found"); return; }
        const data = (await res.json()) as EventForm;
        setForm(data);
        const normalized = normalizeSections({ sections: data.sections ?? [], fields: data.fields });
        setSections(normalized);
        const initial: Record<string, FieldAnswer> = {};
        for (const f of getAllFields(normalized)) {
          initial[f.id] = defaultAnswer(f);
        }
        setAnswers(initial);
        setLoadState("ready");
      })
      .catch(() => setLoadState("not-found"));
  }, [formId]);

  /* ── Render states ──────────────────────────────────────────────────────── */
  if (loadState === "loading") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#DA291C] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (loadState === "not-found") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Form Not Found</h1>
          <p className="mt-2 text-sm text-neutral-500">This registration form does not exist.</p>
        </div>
      </div>
    );
  }

  if (loadState === "closed") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Registration Closed</h1>
          <p className="mt-2 text-sm text-neutral-500">
            This registration form is not currently open.
          </p>
        </div>
      </div>
    );
  }

  if (submitState === "success") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">You&apos;re registered!</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Your registration has been submitted successfully. Keep this confirmation for check-in.
          </p>

          {confirmation && (
            <div className="mt-6 space-y-4">
              {/* QR Code */}
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={confirmation.qrDataUrl}
                  alt="Registration QR Code"
                  width={200}
                  height={200}
                  className="rounded-xl border border-neutral-200 p-2"
                />
              </div>

              {/* 6-digit code */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Confirmation Code</p>
                <div className="flex items-center justify-center gap-1.5">
                  {confirmation.code.split("").map((digit, i) => (
                    <span
                      key={i}
                      className="flex h-11 w-9 items-center justify-center rounded-lg bg-neutral-100 text-xl font-bold text-neutral-900 font-mono"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(confirmation.code)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
              >
                Copy Code
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DA291C]">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="3" width="9" height="9" rx="2" fill="white" />
              <rect x="16" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
              <rect x="3" y="16" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
              <rect x="16" y="16" width="9" height="9" rx="2" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{form?.title}</h1>
          {form?.description && (
            <p className="mt-2 text-sm text-neutral-500">{form.description}</p>
          )}
          {form?.eventRef && (
            <p className="mt-1 text-xs text-neutral-400">Event: {form.eventRef}</p>
          )}
        </div>

        {/* Section progress indicator */}
        {sections.length > 1 && (
          <div className="mb-6">
            {/* Step dots */}
            <div className="flex items-center justify-center gap-0">
              {sections.map((sec, i) => (
                <div key={sec.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      // Only allow navigating to already-visited sections
                      if (i < currentSection) {
                        setSectionError("");
                        setCurrentSection(i);
                      }
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                      i === currentSection
                        ? "bg-[#DA291C] text-white shadow-sm"
                        : i < currentSection
                        ? "bg-[#DA291C]/20 text-[#DA291C] cursor-pointer hover:bg-[#DA291C]/30"
                        : "bg-neutral-200 text-neutral-400 cursor-default"
                    }`}
                  >
                    {i < currentSection ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </button>
                  {i < sections.length - 1 && (
                    <div className={`h-0.5 w-8 transition-colors ${i < currentSection ? "bg-[#DA291C]/40" : "bg-neutral-200"}`} />
                  )}
                </div>
              ))}
            </div>
            {/* Section label */}
            <p className="mt-3 text-center text-xs text-neutral-500">
              Section <span className="font-semibold text-neutral-700">{currentSection + 1}</span> of{" "}
              <span className="font-semibold text-neutral-700">{sections.length}</span>
              {sections[currentSection]?.title && (
                <> — <span className="font-medium text-neutral-700">{sections[currentSection].title}</span></>
              )}
            </p>
          </div>
        )}

        {/* Section card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Validate current section required fields
            const sec = sections[currentSection];
            for (const field of sec?.fields ?? []) {
              if (!field.required) continue;
              const val = answers[field.id];
              if (field.type === "checkbox-group") {
                if (!Array.isArray(val) || val.length === 0) {
                  setSectionError(`"${field.label}" requires at least one selection.`);
                  return;
                }
              } else if (field.type !== "checkbox" && (val === "" || val === undefined || val === null)) {
                setSectionError(`"${field.label}" is required.`);
                return;
              }
            }
            setSectionError("");

            if (currentSection < sections.length - 1) {
              setCurrentSection((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              // Last section — submit
              void (async () => {
                setSubmitting(true);
                setErrorMsg("");
                try {
                  const res = await fetch(`/api/register/${formId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(answers),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setErrorMsg(data.error ?? "Submission failed. Please try again.");
                    setSubmitState("error");
                  } else {
                    setConfirmation({ code: data.confirmationCode, qrDataUrl: data.qrDataUrl });
                    setSubmitState("success");
                  }
                } catch {
                  setErrorMsg("Network error. Please check your connection and try again.");
                  setSubmitState("error");
                } finally {
                  setSubmitting(false);
                }
              })();
            }
          }}
          className="rounded-2xl border border-neutral-200 bg-white px-6 py-7 shadow-sm"
        >
          {/* Section heading (single-section forms don't need it) */}
          {sections.length > 1 && sections[currentSection] && (
            <div className="mb-6 pb-4 border-b border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900">{sections[currentSection].title}</h2>
              {sections[currentSection].description && (
                <p className="mt-1 text-sm text-neutral-500">{sections[currentSection].description}</p>
              )}
            </div>
          )}

          {/* Fields for current section */}
          <div className="space-y-5">
            {(sections[currentSection]?.fields ?? []).map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <FormInput
                  field={field}
                  value={answers[field.id] ?? defaultAnswer(field)}
                  onChange={(val) => {
                    setSectionError("");
                    setAnswers((prev) => ({ ...prev, [field.id]: val }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Validation / submission error */}
          {(sectionError || submitState === "error") && (
            <p className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
              {sectionError || errorMsg}
            </p>
          )}

          {/* Navigation buttons */}
          <div className={`mt-7 flex ${currentSection > 0 ? "justify-between" : "justify-end"}`}>
            {currentSection > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSectionError("");
                  setCurrentSection((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#DA291C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b8211a] disabled:opacity-60 transition"
            >
              {submitting
                ? "Submitting…"
                : currentSection < sections.length - 1
                ? "Next →"
                : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
