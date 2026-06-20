import Link from "next/link";
import type { Insight } from "@/types";

const TYPE_STYLE: Record<string, string> = {
  sleep:        "bg-blue-50 text-blue-700",
  stress:       "bg-red-50 text-red-600",
  energy:       "bg-amber-50 text-amber-700",
  mood:         "bg-purple-50 text-purple-700",
  relationship: "bg-green-50 text-green-700",
};

export function DiscoveryFeedItem({ insight }: { insight: Insight }) {
  const typeStyle = TYPE_STYLE[insight.type] ?? "bg-lavender text-indigo";
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeStyle}`}>
          {insight.type}
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-muted">
          {insight.confidence}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{insight.title}</h3>
      <p className="mt-2 text-muted">{insight.summary}</p>
      {insight.evidence.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {insight.evidence.slice(0, 2).map((e, i) => (
            <li key={i}>· {e}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 rounded-2xl bg-mist p-4">
        <p className="text-sm font-medium text-ink">{insight.reflection}</p>
      </div>
      <Link
        href={`/insights/${insight.id}`}
        className="mt-4 inline-flex text-sm font-semibold text-indigo hover:underline"
      >
        View full analysis →
      </Link>
    </div>
  );
}
