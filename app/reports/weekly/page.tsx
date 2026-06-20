import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DiscoveryFeedItem } from "@/components/discovery-feed-item";
import { ReportsNav } from "@/components/reports-nav";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";

function a(values: number[]) {
  if (!values.length) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function fmt(n: number | null, unit = ""): string {
  return n != null ? `${n.toFixed(1)}${unit}` : "—";
}

function delta(curr: number | null, prev: number | null, invert = false): string | null {
  if (curr == null || prev == null) return null;
  const d = curr - prev;
  if (Math.abs(d) < 0.1) return null;
  const up = invert ? d < 0 : d > 0;
  return `${up ? "↑" : "↓"} ${Math.abs(d).toFixed(1)} vs last week`;
}

export default async function WeeklyReport() {
  const weekFrom = isoDateDaysAgo(6);
  const priorFrom = isoDateDaysAgo(13);
  const today = new Date().toISOString().slice(0, 10);

  const allCheckIns = await getCheckIns({ from: isoDateDaysAgo(60) });
  const weekCheckIns = allCheckIns.filter((c) => c.date >= weekFrom);
  const priorCheckIns = allCheckIns.filter((c) => c.date >= priorFrom && c.date < weekFrom);
  const insights = generateInsights(allCheckIns);

  const range = weekCheckIns.length
    ? `${weekCheckIns[weekCheckIns.length - 1].date} — ${weekCheckIns[0].date}`
    : `${weekFrom} — ${today}`;

  const wMood = a(weekCheckIns.map((c) => c.mood));
  const wEnergy = a(weekCheckIns.map((c) => c.energy));
  const wStress = a(weekCheckIns.map((c) => c.stress));
  const wSleep = a(weekCheckIns.map((c) => c.sleepHours));
  const pMood = a(priorCheckIns.map((c) => c.mood));
  const pEnergy = a(priorCheckIns.map((c) => c.energy));
  const pStress = a(priorCheckIns.map((c) => c.stress));
  const pSleep = a(priorCheckIns.map((c) => c.sleepHours));

  const activityCounts = weekCheckIns
    .flatMap((c) => c.activities)
    .reduce<Record<string, number>>((acc, a) => ({ ...acc, [a]: (acc[a] ?? 0) + 1 }), {});
  const topActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const peopleCounts = weekCheckIns
    .flatMap((c) => c.people)
    .reduce<Record<string, number>>((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});
  const topPeople = Object.entries(peopleCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const bestDay = weekCheckIns.length
    ? weekCheckIns.reduce((best, c) => (c.mood > best.mood ? c : best))
    : null;

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Weekly Report</h1>
        <p className="mt-3 text-muted">{range}</p>
      </div>
      <ReportsNav active="weekly" />
    </div>
  );

  if (!weekCheckIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-5xl px-6 py-14">
          {header}
          <div className="card mt-12 flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-lg text-muted">No check-ins this week yet. Start now and your patterns will appear here.</p>
            <Link href="/check-in" className="btn-primary">Check in today</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-14">
        {header}

        {/* Stats grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Check-ins", value: weekCheckIns.length.toString(), sub: `${priorCheckIns.length} last week` },
            { label: "Avg mood", value: fmt(wMood), sub: delta(wMood, pMood) },
            { label: "Avg energy", value: fmt(wEnergy), sub: delta(wEnergy, pEnergy) },
            { label: "Avg stress", value: fmt(wStress), sub: delta(wStress, pStress, true) },
            { label: "Avg sleep", value: fmt(wSleep, "h"), sub: delta(wSleep, pSleep) },
            { label: "Best mood day", value: bestDay ? `${bestDay.mood}` : "—", sub: bestDay ? bestDay.date : undefined },
          ].map(({ label, value, sub }) => (
            <div className="card p-5" key={label}>
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-1 text-4xl font-bold">{value}</div>
              {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
            </div>
          ))}
        </div>

        {/* Activities & people */}
        {(topActivities.length > 0 || topPeople.length > 0) && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {topActivities.length > 0 && (
              <div className="card p-5">
                <p className="text-sm font-semibold text-muted">Activities this week</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topActivities.map(([name, count]) => (
                    <span key={name} className="flex items-center gap-1 rounded-full bg-lavender px-3 py-1 text-xs font-medium text-indigo">
                      {name} <span className="opacity-60">×{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {topPeople.length > 0 && (
              <div className="card p-5">
                <p className="text-sm font-semibold text-muted">People this week</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topPeople.map(([name, count]) => (
                    <span key={name} className="flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-xs font-medium text-muted">
                      {name} <span className="opacity-60">×{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insights feed */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Discoveries</h2>
        {insights.length ? (
          <div className="mt-4 space-y-4">
            {insights.slice(0, 5).map((i) => <DiscoveryFeedItem key={i.id} insight={i} />)}
            {insights.length > 5 && (
              <Link href="/insights" className="block text-center text-sm font-semibold text-indigo hover:underline">
                View all {insights.length} discoveries →
              </Link>
            )}
          </div>
        ) : (
          <div className="card mt-4 p-10 text-center">
            <p className="text-muted">
              {allCheckIns.length < 5
                ? `${allCheckIns.length} check-in${allCheckIns.length === 1 ? "" : "s"} so far — discoveries unlock after 5.`
                : "No patterns detected yet. Keep going!"}
            </p>
            <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
