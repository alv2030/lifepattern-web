"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const RATINGS = [
  { label: "Accurate", value: "accurate" },
  { label: "Somewhat", value: "somewhat" },
  { label: "Not accurate", value: "not_accurate" },
] as const;

type Rating = "accurate" | "somewhat" | "not_accurate";

export function FeedbackButtons({ insightId }: { insightId: string }) {
  const [saved, setSaved] = useState<Rating | null>(null);
  const [saving, setSaving] = useState(false);

  async function rate(rating: Rating) {
    if (saved || saving) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("insight_feedback").insert({
        user_id: session.user.id,
        insight_key: insightId,
        rating,
      });
    }
    setSaved(rating);
    setSaving(false);
  }

  if (saved) {
    return (
      <p className="mt-8 text-sm text-muted">
        Thanks for the feedback — this helps improve your discoveries.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-semibold text-muted">Was this discovery useful?</p>
      <div className="flex flex-wrap gap-3">
        {RATINGS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className="btn-secondary disabled:opacity-50"
            disabled={saving}
            onClick={() => rate(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
