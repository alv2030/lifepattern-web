"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpdate() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="card p-8">
          <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
          <p className="mt-2 text-muted">Choose a strong password for your account.</p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">New password</span>
              <input
                className="input mt-2"
                type="password"
                placeholder="8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && password.length >= 8 && handleUpdate()}
              />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              className="btn-primary w-full disabled:opacity-50"
              type="button"
              onClick={handleUpdate}
              disabled={loading || password.length < 8}
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
