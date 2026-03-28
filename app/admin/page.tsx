"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CORRECT_PIN = "168168";
const PIN_SESSION_KEY = "navahub_pin_verified";

export default function AdminPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(PIN_SESSION_KEY) === "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  function handleDigit(digit: string) {
    if (pin.length >= 6) return;
    const next = pin + digit;
    setPin(next);
    setError(false);

    if (next.length === 6) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem(PIN_SESSION_KEY, "true");
        router.push("/admin/login");
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin("");
          setShake(false);
        }, 600);
      }
    }
  }

  function handleDelete() {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }

  const digits = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xs text-center">
        {/* Logo mark */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DA291C]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="9" height="9" rx="2" fill="white" />
            <rect x="16" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
            <rect x="3" y="16" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
            <rect x="16" y="16" width="9" height="9" rx="2" fill="white" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-white tracking-wide">Enter PIN</h1>
        <p className="mt-1 text-sm text-neutral-500">Enter your 6-digit access PIN to continue</p>

        {/* PIN dots */}
        <div
          className={`mt-8 flex justify-center gap-3 transition-transform ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? error
                    ? "border-red-500 bg-red-500"
                    : "border-[#DA291C] bg-[#DA291C]"
                  : "border-neutral-600 bg-transparent"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium text-red-500">Incorrect PIN. Try again.</p>
        )}

        {/* Keypad */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {digits.flat().map((key, idx) => {
            if (key === "") return <div key={idx} />;
            if (key === "⌫") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={handleDelete}
                  className="flex h-16 items-center justify-center rounded-2xl bg-neutral-800 text-xl text-neutral-300 transition active:bg-neutral-700 hover:bg-neutral-700"
                >
                  ⌫
                </button>
              );
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDigit(key)}
                className="flex h-16 items-center justify-center rounded-2xl bg-neutral-800 text-xl font-semibold text-white transition active:bg-[#DA291C] hover:bg-neutral-700 select-none"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
