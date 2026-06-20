import Link from "next/link";
import type { Insight } from "@/types";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link href={`/insights/${insight.id}`} className="card block p-6 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-4 inline-flex rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-indigo">{insight.confidence}</div>
      <h3 className="text-xl font-semibold tracking-tight">{insight.title}</h3>
      <p className="mt-3 text-muted">{insight.summary}</p>
      <div className="mt-5 text-sm font-semibold text-indigo">View evidence →</div>
    </Link>
  );
}
