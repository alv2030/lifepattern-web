"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

type Mode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.session) {
        router.push("/onboarding");
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push(next);
      router.refresh();
    }
    setLoading(false);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setCheckEmail(false);
  }

  if (checkEmail) {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-6 py-14">
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lavender text-2xl font-bold text-indigo">@</div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">Check your email</h1>
            <p className="mt-3 text-muted">We sent a confirmation link to <span className="font-semibold text-ink">{email}</span>. Click it to activate your account.</p>
            <button className="btn-secondary mt-6" onClick={() => setCheckEmail(false)}>Back to sign in</button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="card p-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-muted">
            {mode === "login"
              ? "Sign in to see your patterns."
              : "Start understanding yourself in 30 seconds a day."}
          </p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                className="input mt-2"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input
                className="input mt-2"
                type="password"
                placeholder="8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              className="btn-primary w-full disabled:opacity-50"
              type="button"
              onClick={handleSubmit}
              disabled={loading || !email || !password}
            >
              {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            {mode === "login" ? "No account? " : "Already have one? "}
            <button
              className="font-semibold text-indigo"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
