"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase-browser";

const ACTIVITIES = ["Work", "Meeting", "Exercise", "Family", "Friends", "Travel", "Reading"];

export default function CheckIn() {
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [activities, setActivities] = useState<string[]>([]);
  const [people, setPeople] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadExisting() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth?next=/check-in");
        return;
      }
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("checkins")
        .select("id, mood_score, energy_score, stress_score, sleep_hours, note, checkin_tags(tags(name, tag_type))")
        .eq("checkin_date", today)
        .maybeSingle();

      if (data) {
        setExistingId(data.id);
        setMood(data.mood_score ?? 7);
        setEnergy(data.energy_score ?? 7);
        setStress(data.stress_score ?? 5);
        setSleepHours(Number(data.sleep_hours ?? 7));
        setNote(data.note ?? "");
        const tags = (data.checkin_tags ?? [])
          .map((ct: { tags: { name: string; tag_type: string } | null }) => ct.tags)
          .filter((t): t is { name: string; tag_type: string } => t !== null);
        setActivities(tags.filter((t) => t.tag_type === "activity").map((t) => t.name));
        setPeople(tags.filter((t) => t.tag_type === "person").map((t) => t.name).join(", "));
      }
      setLoading(false);
    }
    loadExisting();
  }, [router]);

  function toggleActivity(activity: string) {
    setActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth?next=/check-in");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const peopleList = people.split(",").map((p) => p.trim()).filter(Boolean);
    const scores = { mood_score: mood, energy_score: energy, stress_score: stress, sleep_hours: sleepHours, note };

    let checkinId: string;
    if (existingId) {
      const { error: updateError } = await supabase.from("checkins").update(scores).eq("id", existingId);
      if (updateError) { setError(updateError.message); setSubmitting(false); return; }
      checkinId = existingId;
      await supabase.from("checkin_tags").delete().eq("checkin_id", checkinId);
    } else {
      const { data: checkin, error: insertError } = await supabase
        .from("checkins")
        .insert({ user_id: session.user.id, checkin_date: today, ...scores })
        .select()
        .single();
      if (insertError) { setError(insertError.message); setSubmitting(false); return; }
      checkinId = checkin.id;
    }

    const allTags = [
      ...activities.map((name) => ({ name, tag_type: "activity" as const })),
      ...peopleList.map((name) => ({ name, tag_type: "person" as const })),
    ];

    if (allTags.length) {
      const { data: tagRows } = await supabase
        .from("tags")
        .upsert(
          allTags.map(({ name, tag_type }) => ({ user_id: session.user.id, name, tag_type })),
          { onConflict: "user_id,name,tag_type" }
        )
        .select();
      if (tagRows?.length) {
        await supabase
          .from("checkin_tags")
          .insert(tagRows.map((tag) => ({ checkin_id: checkinId, tag_id: tag.id })));
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  if (loading) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-6 py-14">
          <div className="card p-10 text-center text-muted">Loading...</div>
        </section>
      </PageShell>
    );
  }

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-6 py-14">
          <div className="card p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-2xl font-bold text-ink">✓</div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              {existingId ? "Check-in updated" : "Check-in complete"}
            </h1>
            <p className="mt-3 text-muted">Your data has been recorded. Patterns emerge after a few more days.</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/dashboard" className="btn-primary">View dashboard</Link>
              <Link href="/reports/weekly" className="btn-secondary">Weekly report</Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-bold tracking-tight">30-second check-in</h1>
          {existingId && <span className="pill">Editing today&apos;s check-in</span>}
        </div>
        {existingId && (
          <p className="mt-2 text-sm text-muted">You already checked in today — your entries are pre-filled. Save to update.</p>
        )}
        <div className="card mt-8 space-y-6 p-6">
          {([
            { label: "Mood", value: mood, set: setMood },
            { label: "Energy", value: energy, set: setEnergy },
            { label: "Stress", value: stress, set: setStress },
          ] as const).map(({ label, value, set }) => (
            <label key={label} className="block">
              <div className="flex justify-between font-semibold">
                <span>{label}</span>
                <span className="text-indigo">{value}</span>
              </div>
              <input
                className="mt-3 w-full accent-indigo"
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => set(Number(e.target.value))}
              />
            </label>
          ))}
          <label className="block">
            <span className="font-semibold">Sleep hours</span>
            <input
              className="input mt-3"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
            />
          </label>
          <div>
            <span className="font-semibold">Activities</span>
            <div className="mt-3 flex flex-wrap gap-3">
              {ACTIVITIES.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => toggleActivity(x)}
                  className={activities.includes(x) ? "rounded-full bg-indigo px-4 py-2 text-sm font-semibold text-white transition" : "pill"}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="font-semibold">People involved</span>
            <input
              className="input mt-3"
              placeholder="Manager, partner, friend..."
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="font-semibold">What stood out today?</span>
            <textarea
              className="input mt-3 min-h-28"
              placeholder="One sentence is enough."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            className="btn-primary disabled:opacity-50"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : existingId ? "Update check-in" : "Complete Check-In"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
