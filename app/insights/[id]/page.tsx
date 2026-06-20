import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { FeedbackButtons } from "@/components/feedback-buttons";
import { sampleCheckIns, sampleInsights } from "@/lib/mock-data";
import { generateInsights } from "@/lib/discovery-engine";

export default async function InsightDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const insight = [...generateInsights(sampleCheckIns), ...sampleInsights].find((i) => i.id === id);
  if (!insight) notFound();
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Link href="/dashboard" className="text-sm font-semibold text-indigo">← Back to dashboard</Link>
        <div className="card mt-6 p-8">
          <div className="mb-4 inline-flex rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-indigo">{insight.confidence}</div>
          <h1 className="text-4xl font-bold tracking-tight">{insight.title}</h1>
          <p className="mt-5 text-xl leading-8 text-muted">{insight.summary}</p>
          <h2 className="mt-8 text-xl font-semibold">Evidence</h2>
          <ul className="mt-4 space-y-3">{insight.evidence.map((e) => <li className="rounded-2xl bg-mist p-4" key={e}>{e}</li>)}</ul>
          <h2 className="mt-8 text-xl font-semibold">Reflection question</h2>
          <p className="mt-3 rounded-2xl bg-amber p-5 text-lg">{insight.reflection}</p>
          <FeedbackButtons insightId={insight.id} />
        </div>
      </section>
    </PageShell>
  );
}
