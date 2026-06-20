import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { InsightCard } from "@/components/insight-card";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";
import { generateInsights } from "@/lib/discovery-engine";

export default async function InsightsPage() {
  const checkIns = await getCheckIns({ from: isoDateDaysAgo(60) });
  const insights = generateInsights(checkIns);

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Insights</h1>
        {checkIns.length < 5 ? (
          <div className="card mt-8 flex flex-col items-center gap-4 py-20 text-center">
            <div className="text-5xl font-bold text-indigo">{checkIns.length}/5</div>
            <p className="text-lg font-semibold">Keep checking in</p>
            <p className="max-w-sm text-muted">
              Insights unlock after 5 check-ins. You need {5 - checkIns.length} more.
            </p>
            <Link href="/check-in" className="btn-primary mt-2">Do today&apos;s check-in</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
