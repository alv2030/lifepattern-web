import { PageShell } from "@/components/page-shell";
import { InsightCard } from "@/components/insight-card";
import { sampleCheckIns } from "@/lib/mock-data";
import { generateInsights } from "@/lib/discovery-engine";

export default function WeeklyReport() {
  const insights = generateInsights(sampleCheckIns);
  const dates = sampleCheckIns.map((c) => c.date).sort();
  const range = dates.length ? `${dates[0]} — ${dates[dates.length - 1]}` : "";

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Discovery Report</h1>
        <p className="mt-3 text-muted">{range}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {insights.length
            ? insights.map((i) => <InsightCard key={i.id} insight={i} />)
            : <p className="text-muted">Check in for at least 5 days to see your first discoveries.</p>}
        </div>
      </section>
    </PageShell>
  );
}
