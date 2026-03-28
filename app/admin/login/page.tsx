"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";

const PIN_SESSION_KEY = "navahub_pin_verified";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(PIN_SESSION_KEY) !== "true") {
      router.replace("/admin");
      return;
    }

    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      if (user) {
        router.replace("/admin/dashboard");
      } else {
        setChecking(false);
      }
    });
    return unsubscribe;
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(clientAuth, email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#DA291C] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DA291C]">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="3" width="9" height="9" rx="2" fill="white" />
              <rect x="16" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
              <rect x="3" y="16" width="9" height="9" rx="2" fill="white" fillOpacity="0.5" />
              <rect x="16" y="16" width="9" height="9" rx="2" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">NavaHub Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage content</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-7 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-[#DA291C]/20 transition focus:border-[#DA291C] focus:ring-2"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-[#DA291C]/20 transition focus:border-[#DA291C] focus:ring-2"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#DA291C] py-2.5 text-sm font-semibold text-white transition hover:bg-[#A51414] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(PIN_SESSION_KEY);
            router.push("/admin");
          }}
          className="mt-4 w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition"
        >
          ← Back to PIN
        </button>
      </div>
    </div>
  );
}
