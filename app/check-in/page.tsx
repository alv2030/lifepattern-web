"use client";

import { useState } from "react";
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
  const router = useRouter();

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

    const { data: checkin, error: checkinError } = await supabase
      .from("checkins")
      .insert({
        user_id: session.user.id,
        checkin_date: today,
        mood_score: mood,
        energy_score: energy,
        stress_score: stress,
        sleep_hours: sleepHours,
        note,
      })
      .select()
      .single();

    if (checkinError) {
      setError(checkinError.message);
      setSubmitting(false);
      return;
    }

    const allTags = [
      ...activities.map((name) => ({ name, tag_type: "activity" as const })),
      ...peopleList.map((name) => ({ name, tag_type: "person" as const })),
    ];

    if (allTags.length && checkin) {
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
          .insert(tagRows.map((tag) => ({ checkin_id: checkin.id, tag_id: tag.id })));
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-6 py-14">
          <div className="card p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-2xl font-bold text-ink">✓</div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Check-in complete</h1>
            <p className="mt-3 text-muted">Your data has been recorded. Patterns emerge after a few more days.</p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">30-second check-in</h1>
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
                  className={activities.includes(x) ? "pill border-indigo/40 bg-lavender text-indigo" : "pill"}
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
            {submitting ? "Saving..." : "Complete Check-In"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
