import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/types";

const TYPE_STYLE: Record<string, string> = {
  sleep:        "bg-mist border border-black/10 text-ink",
  stress:       "bg-[#FEE2E2] text-[#991B1B]",
  energy:       "bg-amber text-[#92400E]",
  mood:         "bg-lavender text-indigo",
  relationship: "bg-sage text-[#166534]",
  "best-day":   "bg-sage text-[#166534]",
  hidden:       "bg-mist text-muted",
};

const CONFIDENCE_STYLE: Record<string, string> = {
  "Strong pattern":   "bg-ink text-white",
  "Possible pattern": "border border-black/10 bg-mist text-ink",
  "Early signal":     "border border-black/[0.08] text-muted",
};

const TYPE_LABEL: Record<string, string> = {
  "best-day": "best day",
};

export function DiscoveryFeedItem({ insight }: { insight: Insight }) {
  const typeStyle       = TYPE_STYLE[insight.type]        ?? "bg-lavender text-indigo";
  const confidenceStyle = CONFIDENCE_STYLE[insight.confidence] ?? "border border-black/10 text-muted";
  const typeLabel       = TYPE_LABEL[insight.type] ?? insight.type;

  return (
    <div className="card group p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(34,34,64,0.09)]">

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeStyle}`}>
          {typeLabel}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${confidenceStyle}`}>
          {insight.confidence}
        </span>
      </div>

      {/* Title + summary */}
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{insight.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{insight.summary}</p>

      {/* Evidence */}
      {insight.evidence.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-l-2 border-black/[0.06] pl-3">
          {insight.evidence.slice(0, 2).map((e, i) => (
            <li key={i} className="text-sm text-muted">
              {e}
            </li>
          ))}
        </ul>
      )}

      {/* Reflection */}
      <blockquote className="mt-5 border-l-2 border-indigo/25 pl-4">
        <p className="text-sm italic leading-relaxed text-muted">{insight.reflection}</p>
      </blockquote>

      {/* CTA */}
      <Link
        href={`/insights/${insight.id}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo transition-all duration-200 hover:gap-2.5"
      >
        View full analysis
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

    </div>
  );
}
