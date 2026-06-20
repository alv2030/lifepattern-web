import type { CheckIn, Insight } from "@/types";

export type ClarityScores = {
  overall: number;
  energy: number;
  stress: number;
  relationship: number;
  happiness: number;
};

function avg(vals: number[]): number {
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function computeClarityScores(
  checkIns: CheckIn[],
  insights: Insight[]
): ClarityScores {
  const byType = (t: string) => insights.filter((i) => i.type === t).length;

  const avgMood = avg(checkIns.map((c) => c.mood));
  const avgEnergy = avg(checkIns.map((c) => c.energy));
  const avgStress = avg(checkIns.map((c) => c.stress));
  const peopleCoverage =
    checkIns.filter((c) => c.people.length > 0).length / checkIns.length;

  // Pattern detectability (60%) + raw metric level (40%)
  const energy = Math.min(
    100,
    Math.round(Math.min(byType("energy") / 4, 1) * 60 + (avgEnergy / 10) * 40)
  );

  const stress = Math.min(
    100,
    Math.round(
      Math.min(byType("stress") / 4, 1) * 60 + ((10 - avgStress) / 10) * 40
    )
  );

  // People data coverage (50%) + relationship insights (50%)
  const relationship = Math.min(
    100,
    Math.round(
      Math.min(byType("relationship") / 3, 1) * 50 + peopleCoverage * 50
    )
  );

  const happiness = Math.min(
    100,
    Math.round(Math.min(byType("mood") / 4, 1) * 60 + (avgMood / 10) * 40)
  );

  const overall = Math.round(
    energy * 0.25 + stress * 0.25 + relationship * 0.2 + happiness * 0.3
  );

  return { overall, energy, stress, relationship, happiness };
}

export function burnoutRisk(checkIns: CheckIn[]): "Low" | "Medium" | "High" {
  const sorted = [...checkIns]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
  if (sorted.length < 4) return "Low";

  const half = Math.floor(sorted.length / 2);
  const a = (arr: CheckIn[], k: "stress" | "energy") =>
    arr.reduce((s, c) => s + c[k], 0) / arr.length;

  const stressTrend = a(sorted.slice(half), "stress") - a(sorted.slice(0, half), "stress");
  const energyTrend = a(sorted.slice(half), "energy") - a(sorted.slice(0, half), "energy");

  // Rising stress + falling energy = burnout pressure
  const risk = stressTrend - energyTrend;
  if (risk >= 2) return "High";
  if (risk >= 0.8) return "Medium";
  return "Low";
}
