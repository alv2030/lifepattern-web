import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DiscoveryFeedItem } from "@/components/discovery-feed-item";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo, saveLifeClarityScore } from "@/lib/data";
import { computeClarityScores, burnoutRisk } from "@/lib/clarity-score";

function a(vals: number[]): string {
  if (!vals.length) return "—";
  return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
}

const RISK_STYLE = {
  Low: "bg-green-50 text-green-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-600",
};

const RISK_DESC = {
  Low: "Stress and energy are stable.",
  Medium: "Stress rising or energy dipping — worth watching.",
  High: "Stress rising while energy falls — consider a recovery day.",
};

export default async function Dashboard() {
  const checkIns = await getCheckIns({ from: isoDateDaysAgo(60) });
  const thirtyDay = checkIns.filter((c) => c.date >= isoDateDaysAgo(29));
  const weekCheckIns = checkIns.filter((c) => c.date >= isoDateDaysAgo(6));

  // Empty — no check-ins at all
  if (!checkIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Your dashboard</h1>
          <div className="card mt-12 flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-lg text-muted">No check-ins yet. Your patterns will appear here once you start.</p>
            <Link href="/check-in" className="btn-primary">Do your first check-in</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  // Sparse — fewer than 5 check-ins
  if (checkIns.length < 5) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Your dashboard</h1>
          <div className="card mt-8 p-10 text-center">
            <div className="text-5xl font-bold text-indigo">{checkIns.length}/5</div>
            <p className="mt-4 text-lg font-semibold">Building your baseline</p>
            <p className="mt-2 text-muted">Insights and your Life Clarity Score unlock after 5 check-ins.</p>
            <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const insights = generateInsights(checkIns);
  const risk = burnoutRisk(checkIns);

  // Life Clarity Score (14+ check-ins required)
  const hasLCS = checkIns.length >= 14;
  const scores = hasLCS ? computeClarityScores(checkIns, insights) : null;

  if (hasLCS && scores) {
    await saveLifeClarityScore(scores);
  }

  const stressTrigger = insights.find((i) => i.id === "stress-top-trigger");
  const energySource = insights.find((i) => i.id === "energy-top-source");
  const happinessDriver = insights.find((i) => i.id === "mood-top-trigger");

  const stats = [
    { label: "Avg mood", value: a(thirtyDay.map((c) => c.mood)) },
    { label: "Avg energy", value: a(thirtyDay.map((c) => c.energy)) },
    { label: "Avg stress", value: a(thirtyDay.map((c) => c.stress)) },
    { label: "Avg sleep", value: thirtyDay.length ? `${a(thirtyDay.map((c) => c.sleepHours))}h` : "—" },
  ];

  const patterns = [
    {
      label: "Top stress trigger",
      insight: stressTrigger,
      empty: "No trigger identified yet",
    },
    {
      label: "Top energy source",
      insight: energySource,
      empty: "No source identified yet",
    },
    {
      label: "Top happiness driver",
      insight: happinessDriver,
      empty: "No driver identified yet",
    },
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your dashboard</h1>
            <p className="mt-3 text-muted">Evidence-backed patterns from the last 60 days.</p>
          </div>
          <span className="pill">{weekCheckIns.length} / 7 this week</span>
        </div>

        {/* Life Clarity Score */}
        {scores ? (
          <div className="mt-8 rounded-3xl bg-ink p-8 text-white shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/60">Life Clarity Score</div>
                <div className="mt-1 text-7xl font-bold leading-none">{scores.overall}</div>
                <div className="mt-2 text-sm text-white/50">
                  Based on {checkIns.length} check-ins · last 60 days
                </div>
              </div>
              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${RISK_STYLE[risk]}`}>
                {risk} burnout risk
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
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
                    <div
                      className="h-1.5 rounded-full bg-white/75 transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card mt-8 flex items-center gap-6 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lavender text-2xl font-bold text-indigo">
              {checkIns.length}
            </div>
            <div>
              <p className="font-semibold">Building your baseline…</p>
              <p className="mt-1 text-sm text-muted">
                Life Clarity Score unlocks at 14 check-ins. {14 - checkIns.length} more to go.
              </p>
            </div>
          </div>
        )}

        {/* 30-day stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div className="card p-5" key={label}>
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-1 text-3xl font-bold">{value}</div>
              <div className="mt-0.5 text-xs text-muted">30-day avg</div>
            </div>
          ))}
        </div>

        {/* Pattern summary + burnout */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {patterns.map(({ label, insight, empty }) => (
            <div className="card p-5" key={label}>
              <div className="text-xs text-muted">{label}</div>
              {insight ? (
                <>
                  <p className="mt-2 text-sm font-semibold leading-snug">{insight.title}</p>
                  <p className="mt-1 text-xs text-muted">{insight.evidence[0]}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">{empty}</p>
              )}
            </div>
          ))}
          <div className="card p-5">
            <div className="text-xs text-muted">Burnout risk</div>
            <div className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLE[risk]}`}>
              {risk}
            </div>
            <p className="mt-2 text-xs text-muted">{RISK_DESC[risk]}</p>
          </div>
        </div>

        {/* Discovery feed */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Discovery feed</h2>
        <p className="mt-1 text-muted">All patterns detected from your check-ins.</p>
        <div className="mt-4">
          {insights.length ? (
            <div className="space-y-4">
              {insights.map((i) => <DiscoveryFeedItem key={i.id} insight={i} />)}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-muted">No patterns detected yet. More check-ins will surface insights.</p>
              <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
