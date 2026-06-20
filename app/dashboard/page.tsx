import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { InsightCard } from "@/components/insight-card";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";

function avg(values: number[]): string | null {
  if (!values.length) return null;
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

export default async function Dashboard() {
  const checkIns = await getCheckIns({ from: isoDateDaysAgo(30) });
  const weekCount = checkIns.filter((c) => c.date >= isoDateDaysAgo(6)).length;
  const insights = generateInsights(checkIns);

  const stats = [
    { label: "Avg mood", value: avg(checkIns.map((c) => c.mood)) },
    { label: "Avg energy", value: avg(checkIns.map((c) => c.energy)) },
    { label: "Avg stress", value: avg(checkIns.map((c) => c.stress)) },
  ];

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

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">This week&apos;s discoveries</h1>
            <p className="mt-3 text-muted">Evidence-backed patterns from your recent check-ins.</p>
          </div>
          <div className="pill">{weekCount} / 7 check-ins complete</div>
        </div>

        {insights.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {insights.map((i) => <InsightCard key={i.id} insight={i} />)}
          </div>
        ) : (
          <div className="card mt-8 p-10 text-center">
            <p className="text-muted">Keep checking in — discoveries appear after 5 or more days of data.</p>
            <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div className="card p-6" key={label}>
              <div className="text-sm text-muted">{label}</div>
              <div className="mt-2 text-4xl font-bold">{value ?? "—"}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
