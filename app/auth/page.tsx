"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

type Mode = "login" | "signup" | "forgot";

const glassCard: React.CSSProperties = {
  background: "rgba(251, 244, 239, 0.84)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.70)",
  boxShadow: "0 24px 64px rgba(30, 27, 24, 0.11)",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
};

function AuthForm() {
  const [mode, setMode]           = useState<Mode>("login");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get("next") ?? "/dashboard";

  // Surface middleware-level errors (e.g. unverified user hitting a protected route)
  const urlError = searchParams.get("error");
  const bannerMessage = urlError === "verify_email"
    ? "Please verify your email before signing in. Check your inbox for the confirmation link."
    : null;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      // Never auto-redirect after signup — always require email verification
      setCheckEmail(true);
      if (data.session) await supabase.auth.signOut();
    } else if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
          setError("Please verify your email before signing in. Check your inbox for the confirmation link.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }
      // Defense-in-depth: block even if Supabase didn't return an error
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError("Please verify your email before signing in. Check your inbox for the confirmation link.");
        setLoading(false);
        return;
      }
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
      <div style={{ ...glassCard, textAlign: "center" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: "rgba(182,138,90,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto", fontSize: "22px", fontWeight: 700, color: "#B68A5A",
        }}>@</div>
        <h1 className="font-heading mt-6 text-2xl font-bold tracking-tight" style={{ color: "#1E1B18" }}>
          {mode === "forgot" ? "Reset link sent" : "Check your email"}
        </h1>
        <p className="mt-3 text-sm" style={{ color: "#6F675F", lineHeight: "1.65" }}>
          {mode === "forgot"
            ? <>We sent a password reset link to <span style={{ fontWeight: 600, color: "#1E1B18" }}>{email}</span>. Check your inbox.</>
            : <>We sent a confirmation link to <span style={{ fontWeight: 600, color: "#1E1B18" }}>{email}</span>. Click it to activate your account.</>}
        </p>
        <button className="lp-btn-secondary mt-6 w-full justify-center" onClick={() => switchMode("login")}>
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div style={glassCard}>
      <h1 className="font-heading text-2xl font-bold tracking-tight" style={{ color: "#1E1B18" }}>
        {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
      </h1>
      <p className="mt-2 text-sm" style={{ color: "#6F675F", lineHeight: "1.65" }}>
        {mode === "login"
          ? "Sign in to see your patterns."
          : mode === "signup"
          ? "Start understanding yourself in 30 seconds a day."
          : "Enter your email and we'll send a reset link."}
      </p>

      {bannerMessage && (
        <div className="mt-5 rounded-2xl px-4 py-3 text-sm" style={{ background: "rgba(182,138,90,0.10)", color: "#7A5A2F", border: "1px solid rgba(182,138,90,0.25)" }}>
          {bannerMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold" style={{ color: "#1E1B18" }}>Email</span>
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
            <span className="text-sm font-semibold" style={{ color: "#1E1B18" }}>Password</span>
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
        {error && <p className="text-sm" style={{ color: "#DC2626" }}>{error}</p>}
        <button
          className="lp-btn-primary w-full justify-center disabled:opacity-50"
          type="button"
          onClick={handleSubmit}
          disabled={loading || !email || (mode !== "forgot" && !password)}
        >
          {loading ? "…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
        {mode === "login" && (
          <button
            type="button"
            className="w-full text-center text-sm transition-colors hover:text-warm-ink"
            style={{ color: "#6F675F" }}
            onClick={() => switchMode("forgot")}
          >
            Forgot password?
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm" style={{ color: "#6F675F" }}>
        {mode === "forgot" ? (
          <>Remember it?{" "}
            <button className="font-semibold transition-colors hover:opacity-80" style={{ color: "#B68A5A" }} onClick={() => switchMode("login")}>Sign in</button>
          </>
        ) : mode === "login" ? (
          <>No account?{" "}
            <button className="font-semibold transition-colors hover:opacity-80" style={{ color: "#B68A5A" }} onClick={() => switchMode("signup")}>Sign up free</button>
          </>
        ) : (
          <>Already have one?{" "}
            <button className="font-semibold transition-colors hover:opacity-80" style={{ color: "#B68A5A" }} onClick={() => switchMode("login")}>Sign in</button>
          </>
        )}
      </p>
    </div>
  );
}

export default function Auth() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Full-viewport garden scene — desktop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-bg-des.PNG"
        alt=""
        aria-hidden
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        style={{ zIndex: 0 }}
      />
      {/* Full-viewport garden scene — mobile */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-bg-phone.PNG"
        alt=""
        aria-hidden
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
        style={{ zIndex: 0 }}
      />

      {/* Minimal pre-auth nav — no app links */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(251, 244, 239, 0.52)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(232, 221, 210, 0.30)",
        }}
      >
        <Link href="/" className="font-heading text-xl font-bold tracking-tight" style={{ color: "#1E1B18" }}>
          LifePattern
        </Link>
        <Link
          href="/"
          className="text-sm transition-colors hover:text-warm-ink"
          style={{ color: "#6F675F" }}
        >
          ← Home
        </Link>
      </header>

      {/* Card centered in the open mist of the scene */}
      <main
        className="relative z-10 flex items-center justify-center px-4 py-10"
        style={{ minHeight: "calc(100vh - 112px)" }}
      >
        <Suspense
          fallback={
            <div style={{
              background: "rgba(251,244,239,0.70)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              height: "340px",
              width: "100%",
              maxWidth: "420px",
            }} />
          }
        >
          <AuthForm />
        </Suspense>
      </main>

      {/* Minimal footer */}
      <footer
        className="relative z-10 flex items-center justify-between px-6 py-4 text-sm"
        style={{
          background: "rgba(251, 244, 239, 0.52)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(232, 221, 210, 0.30)",
          color: "#6F675F",
        }}
      >
        <span>© 2026 LifePattern</span>
        <Link href="/privacy" className="transition-colors hover:text-warm-ink" style={{ color: "#6F675F" }}>
          Privacy
        </Link>
      </footer>
    </div>
  );
}
