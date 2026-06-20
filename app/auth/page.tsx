"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

type Mode = "login" | "signup" | "forgot";

function AuthForm() {
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
      if (data.session) { router.push("/onboarding"); router.refresh(); }
      else setCheckEmail(true);
    } else if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setCheckEmail(true);
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
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lavender text-2xl font-bold text-indigo">@</div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            {mode === "forgot" ? "Reset link sent" : "Check your email"}
          </h1>
          <p className="mt-3 text-muted">
            {mode === "forgot"
              ? <>We sent a password reset link to <span className="font-semibold text-ink">{email}</span>. Check your inbox.</>
              : <>We sent a confirmation link to <span className="font-semibold text-ink">{email}</span>. Click it to activate your account.</>}
          </p>
          <button className="btn-secondary mt-6" onClick={() => switchMode("login")}>Back to sign in</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-14">
      <div className="card p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-2 text-muted">
          {mode === "login"
            ? "Sign in to see your patterns."
            : mode === "signup"
            ? "Start understanding yourself in 30 seconds a day."
            : "Enter your email and we'll send a reset link."}
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
          {mode !== "forgot" && (
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
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            className="btn-primary w-full disabled:opacity-50"
            type="button"
            onClick={handleSubmit}
            disabled={loading || !email || (mode !== "forgot" && !password)}
          >
            {loading ? "..." : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
          {mode === "login" && (
            <button
              type="button"
              className="w-full text-center text-sm text-muted hover:text-ink"
              onClick={() => switchMode("forgot")}
            >
              Forgot password?
            </button>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          {mode === "forgot" ? (
            <>Remember it? <button className="font-semibold text-indigo" onClick={() => switchMode("login")}>Sign in</button></>
          ) : mode === "login" ? (
            <>No account? <button className="font-semibold text-indigo" onClick={() => switchMode("signup")}>Sign up</button></>
          ) : (
            <>Already have one? <button className="font-semibold text-indigo" onClick={() => switchMode("login")}>Sign in</button></>
          )}
        </p>
      </div>
    </section>
  );
}

export default function Auth() {
  return (
    <PageShell>
      <Suspense fallback={<div className="mx-auto max-w-md px-6 py-14"><div className="card p-8 h-64 animate-pulse bg-mist" /></div>}>
        <AuthForm />
      </Suspense>
    </PageShell>
  );
}
