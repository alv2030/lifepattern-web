import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DiscoveryFeedItem } from "@/components/discovery-feed-item";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";

function avgFmt(values: number[]): string {
  if (!values.length) return "—";
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

export default async function Dashboard() {
  const checkIns = await getCheckIns({ from: isoDateDaysAgo(60) });
  const weekCheckIns = checkIns.filter((c) => c.date >= isoDateDaysAgo(6));
  const insights = generateInsights(checkIns);

  if (!checkIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Your dashboard</h1>
          <div className="card mt-12 flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-lg text-muted">No check-ins yet. Your patterns will appear here once you start.</p>
            <Link href="/check-in" className="btn-primary">Do your first check-in</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const stats = [
    { label: "Avg mood", value: avgFmt(checkIns.map((c) => c.mood)) },
    { label: "Avg energy", value: avgFmt(checkIns.map((c) => c.energy)) },
    { label: "Avg stress", value: avgFmt(checkIns.map((c) => c.stress)) },
    { label: "Avg sleep", value: checkIns.length ? `${avgFmt(checkIns.map((c) => c.sleepHours))}h` : "—" },
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Discovery feed</h1>
            <p className="mt-3 text-muted">Evidence-backed patterns from your recent check-ins.</p>
          </div>
          <span className="pill">{weekCheckIns.length} / 7 this week</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div className="card p-5" key={label}>
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-1 text-3xl font-bold">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {insights.length ? (
            <div className="space-y-4">
              {insights.map((i) => <DiscoveryFeedItem key={i.id} insight={i} />)}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-muted">
                {checkIns.length < 5
                  ? `${checkIns.length} check-in${checkIns.length === 1 ? "" : "s"} so far — discoveries unlock after 5.`
                  : "No patterns detected yet. More check-ins will surface insights."}
              </p>
              <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
