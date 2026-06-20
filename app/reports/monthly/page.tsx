import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ReportsNav } from "@/components/reports-nav";
import { DiscoveryFeedItem } from "@/components/discovery-feed-item";
import { SparkLine } from "@/components/spark-line";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";
import { computeClarityScores, burnoutRisk } from "@/lib/clarity-score";
import type { CheckIn } from "@/types";

// ─── helpers ──────────────────────────────────────────────────────────────────

function avgOf(arr: CheckIn[], key: keyof Pick<CheckIn, "mood" | "energy" | "stress" | "sleepHours">) {
  if (!arr.length) return 0;
  return arr.reduce((s, c) => s + c[key], 0) / arr.length;
}

function riskLevel(r: "Low" | "Medium" | "High") {
  return r === "High" ? 2 : r === "Medium" ? 1 : 0;
}

function trendLabel(data: number[]): { text: string; up: boolean | null } {
  if (data.length < 4) return { text: "Not enough data", up: null };
  const half = Math.floor(data.length / 2);
  const earlier = data.slice(0, half);
  const later = data.slice(half);
  const avgE = earlier.reduce((s, v) => s + v, 0) / earlier.length;
  const avgL = later.reduce((s, v) => s + v, 0) / later.length;
  const d = avgL - avgE;
  if (Math.abs(d) < 0.2) return { text: "Stable", up: null };
  return { text: `${d > 0 ? "↑" : "↓"} ${Math.abs(d).toFixed(1)} vs earlier`, up: d > 0 };
}

const RECOVERY_ACTS = new Set(["Exercise", "Family", "Friends", "Travel", "Reading", "Meditation", "Rest"]);
const WORK_ACTS = new Set(["Work", "Meeting"]);

const RISK_PILL = {
  Low: "bg-green-50 text-green-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-600",
};

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function MonthlyReport() {
  const from = isoDateDaysAgo(29);
  const checkIns = await getCheckIns({ from });
  const label = "Last 30 days";

  const emptyHeader = (
    <div className="rounded-3xl bg-ink p-10 text-white shadow-soft">
      <div className="text-white/60">{label}</div>
      <h1 className="mt-3 text-5xl font-bold tracking-tight">Life Clarity Report</h1>
      <div className="mt-8 text-7xl font-bold">—</div>
      <div className="mt-2 text-white/70">Life Clarity Score</div>
    </div>
  );

  if (!checkIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-6 flex justify-end"><ReportsNav active="monthly" /></div>
          {emptyHeader}
          <div className="card mt-8 flex flex-col items-center gap-6 py-16 text-center">
            <p className="text-lg text-muted">No check-ins in the last 30 days. Start now and your report will appear here.</p>
            <Link href="/check-in" className="btn-primary">Check in today</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const sortedAsc = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const insights = generateInsights(checkIns);
  const scores = checkIns.length >= 14 ? computeClarityScores(checkIns, insights) : null;

  // ── Trends ──────────────────────────────────────────────────────────────────
  const moodSeries = sortedAsc.map((c) => c.mood);
  const stressSeries = sortedAsc.map((c) => c.stress);
  const energySeries = sortedAsc.map((c) => c.energy);

  const moodTrend = trendLabel(moodSeries);
  const stressTrend = trendLabel(stressSeries);
  const energyTrend = trendLabel(energySeries);

  // Stress burnout warning: 2-week upward trend
  const last14 = checkIns.filter((c) => c.date >= isoDateDaysAgo(13));
  const prev14 = checkIns.filter((c) => c.date >= isoDateDaysAgo(27) && c.date < isoDateDaysAgo(13));
  const stressWarning =
    last14.length >= 3 &&
    prev14.length >= 3 &&
    avgOf(last14, "stress") > avgOf(prev14, "stress") + 0.3;

  // ── Burnout predictor ────────────────────────────────────────────────────────
  const risk = burnoutRisk(last14.length >= 4 ? last14 : checkIns);
  const priorRisk = burnoutRisk(prev14);
  const earlyWarning = riskLevel(risk) > riskLevel(priorRisk);

  function signalStatus(delta: number, higherIsBetter: boolean): "good" | "warning" | "alert" {
    const bad = higherIsBetter ? delta < -0.3 : delta > 0.3;
    const veryBad = higherIsBetter ? delta < -1.0 : delta > 1.0;
    if (veryBad) return "alert";
    if (bad) return "warning";
    return "good";
  }

  function signalStatusPct(delta: number, higherIsBetter: boolean): "good" | "warning" | "alert" {
    const bad = higherIsBetter ? delta < -10 : delta > 10;
    const veryBad = higherIsBetter ? delta < -25 : delta > 25;
    if (veryBad) return "alert";
    if (bad) return "warning";
    return "good";
  }

  const STATUS_STYLE = {
    good: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    alert: "bg-red-50 text-red-600",
  };

  const workCurr = last14.length
    ? (last14.filter((c) => c.activities.some((a) => WORK_ACTS.has(a))).length / last14.length) * 100
    : 0;
  const workPrev = prev14.length
    ? (prev14.filter((c) => c.activities.some((a) => WORK_ACTS.has(a))).length / prev14.length) * 100
    : 0;
  const recCurr = last14.length
    ? (last14.filter((c) => c.activities.some((a) => RECOVERY_ACTS.has(a))).length / last14.length) * 100
    : 0;
  const recPrev = prev14.length
    ? (prev14.filter((c) => c.activities.some((a) => RECOVERY_ACTS.has(a))).length / prev14.length) * 100
    : 0;

  const signals = [
    {
      label: "Stress",
      curr: avgOf(last14, "stress"),
      delta: avgOf(last14, "stress") - avgOf(prev14, "stress"),
      unit: "/10",
      fmt: (v: number) => v.toFixed(1),
      status: prev14.length ? signalStatus(avgOf(last14, "stress") - avgOf(prev14, "stress"), false) : ("good" as const),
      hasPrev: prev14.length > 0,
    },
    {
      label: "Energy",
      curr: avgOf(last14, "energy"),
      delta: avgOf(last14, "energy") - avgOf(prev14, "energy"),
      unit: "/10",
      fmt: (v: number) => v.toFixed(1),
      status: prev14.length ? signalStatus(avgOf(last14, "energy") - avgOf(prev14, "energy"), true) : ("good" as const),
      hasPrev: prev14.length > 0,
    },
    {
      label: "Sleep",
      curr: avgOf(last14, "sleepHours"),
      delta: avgOf(last14, "sleepHours") - avgOf(prev14, "sleepHours"),
      unit: "h",
      fmt: (v: number) => v.toFixed(1),
      status: prev14.length ? signalStatus(avgOf(last14, "sleepHours") - avgOf(prev14, "sleepHours"), true) : ("good" as const),
      hasPrev: prev14.length > 0,
    },
    {
      label: "Work intensity",
      curr: workCurr,
      delta: workCurr - workPrev,
      unit: "% of days",
      fmt: (v: number) => Math.round(v).toString(),
      status: prev14.length ? signalStatusPct(workCurr - workPrev, false) : ("good" as const),
      hasPrev: prev14.length > 0,
    },
    {
      label: "Recovery",
      curr: recCurr,
      delta: recCurr - recPrev,
      unit: "% of days",
      fmt: (v: number) => Math.round(v).toString(),
      status: prev14.length ? signalStatusPct(recCurr - recPrev, true) : ("good" as const),
      hasPrev: prev14.length > 0,
    },
  ];

  // Recommendations
  const lastRecoveryDate = sortedAsc
    .filter((c) => c.activities.some((a) => RECOVERY_ACTS.has(a)))
    .slice(-1)[0]?.date;
  const daysSinceRecovery = lastRecoveryDate
    ? Math.round((Date.now() - new Date(lastRecoveryDate).getTime()) / 86400000)
    : null;

  const recs: string[] = [];
  if (daysSinceRecovery !== null && daysSinceRecovery >= 3) {
    recs.push(
      `You haven't logged a recovery activity in ${daysSinceRecovery} day${daysSinceRecovery === 1 ? "" : "s"}. Consider adding one soon.`
    );
  }
  if (avgOf(last14, "stress") - avgOf(prev14, "stress") > 0.5 && prev14.length) {
    recs.push("Stress is trending up. Try to schedule buffer time or a dedicated recovery day.");
  }
  if (avgOf(last14, "energy") - avgOf(prev14, "energy") < -0.5 && prev14.length) {
    recs.push("Energy is declining. Prioritise sleep and cut low-value commitments.");
  }
  if (avgOf(last14, "sleepHours") - avgOf(prev14, "sleepHours") < -0.3 && prev14.length) {
    recs.push("Sleep hours are falling. Aim for 7–8 hours to protect mood and focus.");
  }

  // ── Activities ──────────────────────────────────────────────────────────────
  const actCounts = checkIns
    .flatMap((c) => c.activities)
    .reduce<Record<string, number>>((acc, a) => ({ ...acc, [a]: (acc[a] ?? 0) + 1 }), {});
  const topActivities = Object.entries(actCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxAct = topActivities[0]?.[1] ?? 1;

  // ── Relationships ────────────────────────────────────────────────────────────
  const overallMood = avgOf(checkIns, "mood");
  const peopleMoods: Record<string, number[]> = {};
  checkIns.forEach((c) =>
    c.people.forEach((p) => {
      peopleMoods[p] = peopleMoods[p] ?? [];
      peopleMoods[p].push(c.mood);
    })
  );
  const topPeople = Object.entries(peopleMoods)
    .map(([name, moods]) => ({
      name,
      count: moods.length,
      avgMood: moods.reduce((s, v) => s + v, 0) / moods.length,
      moodDelta: moods.reduce((s, v) => s + v, 0) / moods.length - overallMood,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // ── Monthly insight ──────────────────────────────────────────────────────────
  const topInsight =
    insights.find((i) => i.confidence === "Strong pattern") ??
    insights.find((i) => i.confidence === "Possible pattern") ??
    insights[0] ??
    null;

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-6 flex justify-end"><ReportsNav active="monthly" /></div>

        {/* ── Hero ─────────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-ink p-10 text-white shadow-soft">
          <div className="text-white/60">{label} · {checkIns.length} check-in{checkIns.length === 1 ? "" : "s"}</div>
          <h1 className="mt-3 text-5xl font-bold tracking-tight">Life Clarity Report</h1>
          {scores ? (
            <>
              <div className="mt-8 flex items-end gap-4">
                <div className="text-7xl font-bold">{scores.overall}</div>
                <div className="mb-2 text-white/70">Life Clarity Score</div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
                {(
                  [
                    { label: "Energy Clarity", value: scores.energy },
                    { label: "Stress Clarity", value: scores.stress },
                    { label: "Relationship Clarity", value: scores.relationship },
                    { label: "Happiness Clarity", value: scores.happiness },
                  ] as const
                ).map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-white/75" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 text-7xl font-bold">—</div>
              <div className="mt-2 text-white/50">Life Clarity Score unlocks at 14 check-ins</div>
            </>
          )}
        </div>

        {/* ── 30-day trends ────────────────────────────────────────────────────── */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight">30-day trends</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {/* Mood */}
          <div className="card overflow-hidden p-5">
            <div className="flex justify-between">
              <div className="text-xs text-muted">Mood</div>
              <div className="text-sm font-semibold">{avgOf(checkIns, "mood").toFixed(1)} avg</div>
            </div>
            <div className="mt-3">
              <SparkLine
                data={moodSeries}
                color="#7c3aed"
                fillColor="rgba(124,58,237,0.08)"
              />
            </div>
            <div className={`mt-2 text-xs ${moodTrend.up === true ? "text-green-600" : moodTrend.up === false ? "text-red-500" : "text-muted"}`}>
              {moodTrend.text}
            </div>
          </div>

          {/* Stress */}
          <div className="card overflow-hidden p-5">
            <div className="flex justify-between">
              <div className="text-xs text-muted">Stress</div>
              <div className="text-sm font-semibold">{avgOf(checkIns, "stress").toFixed(1)} avg</div>
            </div>
            <div className="mt-3">
              <SparkLine
                data={stressSeries}
                color="#ef4444"
                fillColor="rgba(239,68,68,0.08)"
              />
            </div>
            <div className={`mt-2 text-xs ${stressTrend.up === false ? "text-green-600" : stressTrend.up === true ? "text-red-500" : "text-muted"}`}>
              {stressTrend.text}
            </div>
            {stressWarning && (
              <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                Stress has been rising for 2+ weeks. Consider a recovery day.
              </div>
            )}
          </div>

          {/* Energy */}
          <div className="card overflow-hidden p-5">
            <div className="flex justify-between">
              <div className="text-xs text-muted">Energy</div>
              <div className="text-sm font-semibold">{avgOf(checkIns, "energy").toFixed(1)} avg</div>
            </div>
            <div className="mt-3">
              <SparkLine
                data={energySeries}
                color="#f59e0b"
                fillColor="rgba(245,158,11,0.08)"
              />
            </div>
            <div className={`mt-2 text-xs ${energyTrend.up === true ? "text-green-600" : energyTrend.up === false ? "text-red-500" : "text-muted"}`}>
              {energyTrend.text}
            </div>
          </div>
        </div>

        {/* ── Burnout Predictor ─────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Burnout Predictor</h2>
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${RISK_PILL[risk]}`}>
            {risk} risk
          </span>
        </div>

        {earlyWarning && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">Early warning: burnout risk is increasing</p>
            <p className="mt-1 text-sm text-amber-700">
              Your recent 14-day trend shows a shift — stress is rising faster than your prior period. Watch the signals below.
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {signals.map(({ label, curr, delta, unit, fmt, status, hasPrev }) => (
            <div className="card p-4" key={label}>
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-1 text-2xl font-bold">
                {fmt(curr)}<span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>
              </div>
              {hasPrev ? (
                <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>
                  {delta > 0.05 ? "↑" : delta < -0.05 ? "↓" : "→"}
                  {" "}{delta > 0 ? "+" : ""}{unit === "% of days" ? `${Math.round(delta)}pp` : delta.toFixed(1)} vs prior
                </div>
              ) : (
                <div className="mt-2 text-xs text-muted">No prior data</div>
              )}
            </div>
          ))}
        </div>

        {recs.length > 0 && (
          <div className="card mt-4 p-6">
            <p className="text-sm font-semibold">Recommendations</p>
            <ul className="mt-3 space-y-2">
              {recs.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="shrink-0 text-amber-500">·</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Activities ───────────────────────────────────────────────────────── */}
        {topActivities.length > 0 && (
          <>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">Activities this month</h2>
            <div className="card mt-4 p-6">
              <div className="space-y-3">
                {topActivities.map(([name, count]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-sm font-medium">{name}</div>
                    <div className="flex-1 overflow-hidden rounded-full bg-mist">
                      <div
                        className="h-2.5 rounded-full bg-indigo/60"
                        style={{ width: `${(count / maxAct) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 shrink-0 text-right text-sm text-muted">{count}×</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Relationships ────────────────────────────────────────────────────── */}
        {topPeople.length > 0 && (
          <>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">Relationships</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {topPeople.map(({ name, count, avgMood, moodDelta }) => (
                <div className="card p-5" key={name}>
                  <div className="text-lg font-semibold">{name}</div>
                  <div className="mt-1 text-sm text-muted">{count} day{count === 1 ? "" : "s"} together</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted">Avg mood with them</div>
                      <div className="mt-0.5 text-2xl font-bold">{avgMood.toFixed(1)}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-sm font-semibold ${moodDelta >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {moodDelta >= 0 ? "+" : ""}{moodDelta.toFixed(1)} mood
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Monthly insight ──────────────────────────────────────────────────── */}
        {topInsight && (
          <>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">Discovery of the month</h2>
            <div className="mt-4">
              <DiscoveryFeedItem insight={topInsight} />
            </div>
          </>
        )}

        {!topInsight && (
          <div className="card mt-10 p-10 text-center">
            <p className="text-muted">
              {checkIns.length < 5
                ? `${checkIns.length} check-in${checkIns.length === 1 ? "" : "s"} so far — discoveries unlock after 5.`
                : "No strong patterns detected yet. Keep checking in."}
            </p>
            <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
