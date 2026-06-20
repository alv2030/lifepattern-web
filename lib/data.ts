import { createClient } from "@/lib/supabase-server";
import type { CheckIn } from "@/types";

function toCheckIn(row: {
  id: string;
  checkin_date: string;
  mood_score: number | null;
  energy_score: number | null;
  stress_score: number | null;
  sleep_hours: number | null;
  note: string | null;
  checkin_tags: { tags: { name: string; tag_type: string } | null }[] | null;
}): CheckIn {
  const tags = (row.checkin_tags ?? []).map((ct) => ct.tags).filter((t): t is { name: string; tag_type: string } => t !== null);
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
}

export function isoDateDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function currentMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
