"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

const GOALS = ["Understand stress", "Improve energy", "Avoid burnout", "Understand myself", "Improve happiness"];
const WORK_TYPES = ["Engineer", "Founder", "Manager", "Consultant", "Healthcare", "Other"];

export default function Onboarding() {
  const [goals, setGoals] = useState<string[]>([]);
  const [workType, setWorkType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function toggleGoal(goal: string) {
    setGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);
  }

  async function handleContinue() {
    setSaving(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email,
        goals,
        work_type: workType,
      }, { onConflict: "id" });
    }
    router.push("/check-in");
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Set up your clarity baseline</h1>
        <div className="mt-8 grid gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Why are you here?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {GOALS.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => toggleGoal(x)}
                  className={goals.includes(x) ? "pill border-indigo/40 bg-lavender text-indigo" : "pill"}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">What kind of work do you do?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {WORK_TYPES.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => setWorkType(x)}
                  className={workType === x ? "pill border-indigo/40 bg-lavender text-indigo" : "pill"}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Privacy promise</h2>
            <p className="mt-3 text-muted">Your data is private by default, exportable, and deletable. AI is used only to explain evidence-backed insights.</p>
          </div>
        </div>
        <button
          onClick={handleContinue}
          disabled={saving}
          className="btn-primary mt-8 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue to first check-in"}
        </button>
      </section>
    </PageShell>
  );
}
