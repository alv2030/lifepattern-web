"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

export default function Account() {
  const [email, setEmail] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
    });
  }, []);

  async function handleExport() {
    setExporting(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("checkins")
      .select("checkin_date, mood_score, energy_score, stress_score, sleep_hours, note, checkin_tags(tags(name, tag_type))")
      .order("checkin_date", { ascending: false });

    if (data) {
      const rows = data.map((r) => {
        const tags = (r.checkin_tags ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((ct: any) => ct.tags as { name: string; tag_type: string } | null)
          .filter((t): t is { name: string; tag_type: string } => t !== null);
        const activities = tags.filter((t) => t.tag_type === "activity").map((t) => t.name).join("; ");
        const people = tags.filter((t) => t.tag_type === "person").map((t) => t.name).join("; ");
        const note = `"${(r.note ?? "").replace(/"/g, '""')}"`;
        return [r.checkin_date, r.mood_score ?? "", r.energy_score ?? "", r.stress_score ?? "", r.sleep_hours ?? "", activities, people, note].join(",");
      });
      const csv = ["date,mood,energy,stress,sleep_hours,activities,people,note", ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lifepattern-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      setError(error.message);
      setDeleting(false);
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Account</h1>

        <div className="card mt-8 p-6">
          <h2 className="text-lg font-semibold">Your details</h2>
          <p className="mt-4 text-muted">
            Signed in as <span className="font-semibold text-ink">{email ?? "—"}</span>
          </p>
        </div>

        <div className="card mt-4 p-6">
          <h2 className="text-lg font-semibold">Export data</h2>
          <p className="mt-2 text-sm text-muted">Download all your check-ins as a CSV file.</p>
          <button
            type="button"
            className="btn-secondary mt-4"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Preparing…" : "Download CSV"}
          </button>
        </div>

        <div className="card mt-4 p-6">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <p className="mt-2 text-sm text-muted">Update your goals and work type.</p>
          <Link href="/onboarding" className="btn-secondary mt-4 inline-flex">
            Re-do onboarding
          </Link>
        </div>

        <div className="card mt-4 border-red-100 p-6">
          <h2 className="text-lg font-semibold text-red-600">Delete account</h2>
          <p className="mt-2 text-sm text-muted">
            Permanently deletes all your check-ins, insights, and account data. This cannot be undone.
          </p>
          {!confirming ? (
            <button
              type="button"
              className="mt-4 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              onClick={() => setConfirming(true)}
            >
              Delete my account
            </button>
          ) : (
            <div className="mt-4 rounded-2xl bg-red-50 p-5">
              <p className="font-semibold text-red-700">Are you sure? This is permanent.</p>
              <p className="mt-1 text-sm text-red-500">All check-ins, tags, insights, and your account will be deleted immediately.</p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, delete everything"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
