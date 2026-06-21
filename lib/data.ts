import { createClient } from "@/lib/supabase-server";
import type { CheckIn } from "@/types";
import type { ClarityScores } from "@/lib/clarity-score";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCheckIn(row: any): CheckIn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = ((row.checkin_tags ?? []) as any[]).flatMap((ct) => {
    const t = ct.tags;
    return t && typeof t.name === "string" ? [t as { name: string; tag_type: string }] : [];
  });
  return {
    id: row.id,
    date: row.checkin_date,
    mood: row.mood_score ?? 0,
    energy: row.energy_score ?? 0,
    stress: row.stress_score ?? 0,
    sleepHours: Number(row.sleep_hours ?? 0),
    activities: tags.filter((t) => t.tag_type === "activity").map((t) => t.name),
    people: tags.filter((t) => t.tag_type === "person").map((t) => t.name),
    note: row.note ?? "",
  };
}

export async function getCheckIns(opts?: { from?: string; to?: string }): Promise<CheckIn[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("checkins")
      .select("id, checkin_date, mood_score, energy_score, stress_score, sleep_hours, note, checkin_tags(tags(name, tag_type))")
      .order("checkin_date", { ascending: false });

    if (opts?.from) query = query.gte("checkin_date", opts.from);
    if (opts?.to) query = query.lte("checkin_date", opts.to);

    const { data } = await query;
    return (data ?? []).map(toCheckIn);
  } catch {
    return [];
  }
}

export function isoDateDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function saveLifeClarityScore(scores: ClarityScores): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("insights")
      .select("id")
      .eq("user_id", user.id)
      .eq("insight_type", "life-clarity-score")
      .eq("end_date", today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("insights")
        .update({
          summary: `Overall: ${scores.overall}/100`,
          evidence: scores as unknown as Record<string, unknown>,
          confidence_score: scores.overall / 100,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("insights").insert({
        user_id: user.id,
        insight_type: "life-clarity-score",
        title: "Life Clarity Score",
        summary: `Overall: ${scores.overall}/100`,
        evidence: scores as unknown as Record<string, unknown>,
        confidence_score: scores.overall / 100,
        start_date: isoDateDaysAgo(60),
        end_date: today,
      });
    }
  } catch {
    // non-critical — score will be saved on next visit
  }
}

export function currentMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
