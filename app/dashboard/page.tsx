import { PageShell } from "@/components/page-shell";
import { InsightCard } from "@/components/insight-card";
import { sampleCheckIns } from "@/lib/mock-data";
import { generateInsights } from "@/lib/discovery-engine";

function avg(values: number[]) {
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

export default function Dashboard() {
  const insights = generateInsights(sampleCheckIns);
  const stats = [
    { label: "Average mood", value: avg(sampleCheckIns.map((c) => c.mood)) },
    { label: "Average energy", value: avg(sampleCheckIns.map((c) => c.energy)) },
    { label: "Average stress", value: avg(sampleCheckIns.map((c) => c.stress)) },
  ];
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><h1 className="text-4xl font-bold tracking-tight">This week’s discoveries</h1><p className="mt-3 text-muted">Evidence-backed patterns from your recent check-ins.</p></div>
          <div className="pill">5 / 7 check-ins complete</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{insights.map((i) => <InsightCard key={i.id} insight={i} />)}</div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div className="card p-6" key={label}><div className="text-sm text-muted">{label}</div><div className="mt-2 text-4xl font-bold">{value}</div></div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
