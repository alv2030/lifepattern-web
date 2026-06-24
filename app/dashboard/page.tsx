import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DiscoveryFeedItem } from "@/components/discovery-feed-item";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, getProfile, isoDateDaysAgo, saveLifeClarityScore } from "@/lib/data";
import { computeClarityScores, burnoutRisk } from "@/lib/clarity-score";

function timeGreeting(): string {
  const h = new Date().getUTCHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function fmtAvg(vals: number[]): string {
  if (!vals.length) return "—";
  return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
}

function clarityLabel(score: number): string {
  if (score >= 80) return "Exceptional clarity";
  if (score >= 60) return "Strong awareness";
  if (score >= 40) return "Patterns forming";
  return "Building baseline";
}

const RISK_STYLE = {
  Low:    "bg-sage    text-[#166534]",
  Medium: "bg-amber   text-[#92400E]",
  High:   "bg-[#FEE2E2] text-[#991B1B]",
};

const RISK_DESC = {
  Low:    "Stress and energy are stable.",
  Medium: "Stress rising or energy dipping — worth watching.",
  High:   "Stress rising while energy falls — consider a recovery day.",
};

const glassCard: React.CSSProperties = {
  background: "rgba(251,244,239,0.76)",
  backdropFilter: "blur(36px)",
  WebkitBackdropFilter: "blur(36px)",
  border: "1px solid rgba(255,240,220,0.55)",
  boxShadow: "0 32px 80px rgba(140,90,40,0.10), inset 0 1px 0 rgba(255,255,255,0.55)",
  borderRadius: "32px",
};

// Natural stone widths — no two identical, like river pebbles
const STONE_W = [46, 40, 44, 38, 43];

export default async function Dashboard() {
  const [checkIns, { name, email }] = await Promise.all([
    getCheckIns({ from: isoDateDaysAgo(60) }),
    getProfile(),
  ]);
  const displayName    = name?.trim() || (email ? email.split("@")[0] : null);
  const thirtyDay      = checkIns.filter((c) => c.date >= isoDateDaysAgo(29));
  const weekCheckIns   = checkIns.filter((c) => c.date >= isoDateDaysAgo(6));
  const todayStr       = new Date().toISOString().slice(0, 10);
  const checkedInToday = checkIns.some((c) => c.date === todayStr);

  /* ── Empty ──────────────────────────────────────────────────────────── */
  if (!checkIns.length) {
    return (
      <PageShell bg="/check-in-bg.PNG">
        <section className="flex min-h-[80vh] items-center justify-center px-5 py-12">
          <div className="w-full px-12 py-14" style={{ ...glassCard, maxWidth: "600px" }}>

            {/* Badge */}
            <span style={{
              display: "inline-block",
              fontSize: "10px", fontWeight: 700,
              letterSpacing: ".16em", textTransform: "uppercase" as const,
              color: "#B68A5A",
              background: "rgba(182,138,90,0.08)",
              border: "1px solid rgba(182,138,90,0.18)",
              borderRadius: "999px",
              padding: "4px 12px",
            }}>
              Your garden awaits
            </span>

            {/* Headline */}
            <h1 className="font-heading mt-5" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-.02em", color: "#1E1B18" }}>
              Plant your first seed.
            </h1>

            {/* Copy */}
            <p className="mt-3" style={{ lineHeight: 1.65, color: "#6F675F" }}>
              Check in daily and your garden begins to grow. Most people see their first discovery within 7 days.
            </p>

            {/* 5 garden stones — all empty, first stone breathes as invitation */}
            <div className="mt-8">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{
                    width: `${STONE_W[i]}px`, height: "26px", borderRadius: "999px",
                    background: "rgba(182,138,90,0.12)",
                    border: "1.5px solid rgba(182,138,90,0.35)",
                    animation: i === 0 ? "stoneGlow 3.8s ease-in-out infinite" : undefined,
                  }} />
                ))}
              </div>
              <p className="mt-3" style={{ fontSize: "11px", color: "#A89B90", letterSpacing: ".03em" }}>
                First discovery unlocks after 5 check-ins
              </p>
            </div>

            {/* CTA */}
            <Link href="/check-in" className="btn-garden mt-8">
              Start your first check-in
            </Link>

          </div>
        </section>
      </PageShell>
    );
  }

  /* ── Sparse (<5) ────────────────────────────────────────────────────── */
  if (checkIns.length < 5) {
    const remaining = 5 - checkIns.length;
    const remainingLabel = remaining === 1
      ? "One more reflection unlocks your first discovery."
      : `${remaining} more reflections to your first discovery.`;
    return (
      <PageShell bg="/check-in-bg.PNG">
        <section className="flex min-h-[80vh] items-center justify-center px-5 py-12">
          <div className="w-full px-12 py-14" style={{ ...glassCard, maxWidth: "600px" }}>

            {/* Badge */}
            <span style={{
              display: "inline-block",
              fontSize: "10px", fontWeight: 700,
              letterSpacing: ".16em", textTransform: "uppercase" as const,
              color: "#B68A5A",
              background: "rgba(182,138,90,0.08)",
              border: "1px solid rgba(182,138,90,0.18)",
              borderRadius: "999px",
              padding: "4px 12px",
            }}>
              Building your garden
            </span>

            {/* Headline */}
            <h1 className="font-heading mt-5" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-.02em", color: "#1E1B18" }}>
              Your garden is learning your patterns.
            </h1>

            {/* Copy */}
            <p className="mt-3" style={{ lineHeight: 1.65, color: "#6F675F" }}>
              You&apos;ve completed {checkIns.length} of 5 check-ins.{" "}
              {remainingLabel}
            </p>

            {/* Garden stones — organic widths, tactile filled, 5th stone breathes */}
            <div className="mt-8">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < checkIns.length;
                  const isNext = i === checkIns.length;
                  return (
                    <div key={i} style={{
                      width: `${STONE_W[i]}px`, height: "26px", borderRadius: "999px",
                      background: filled
                        ? "linear-gradient(160deg, #D4A574 0%, #8B5E2E 100%)"
                        : "rgba(182,138,90,0.12)",
                      border: filled ? "none" : "1.5px solid rgba(182,138,90,0.35)",
                      boxShadow: filled
                        ? "0 2px 4px rgba(80,40,10,0.20), inset 0 2px 0 rgba(255,255,255,0.30)"
                        : "none",
                      animation: isNext ? "stoneGlow 3.8s ease-in-out infinite" : undefined,
                    }} />
                  );
                })}
              </div>
              <p className="mt-3" style={{ fontSize: "11px", color: "#A89B90", letterSpacing: ".03em" }}>
                Your first discovery is almost ready.
              </p>
            </div>

            {/* CTA */}
            <Link href="/check-in" className="btn-garden mt-8">
              Check in now
            </Link>

          </div>
        </section>
      </PageShell>
    );
  }

  /* ── Full state ─────────────────────────────────────────────────────── */
  const insights = generateInsights(checkIns);
  const risk = burnoutRisk(checkIns);
  const hasLCS = checkIns.length >= 14;
  const scores = hasLCS ? computeClarityScores(checkIns, insights) : null;

  if (hasLCS && scores) {
    await saveLifeClarityScore(scores);
  }

  const stressTrigger   = insights.find((i) => i.id === "stress-top-trigger");
  const energySource    = insights.find((i) => i.id === "energy-top-source");
  const happinessDriver = insights.find((i) => i.id === "mood-top-trigger");

  const stats = [
    { label: "Mood",   value: fmtAvg(thirtyDay.map((c) => c.mood)),       unit: "/10" },
    { label: "Energy", value: fmtAvg(thirtyDay.map((c) => c.energy)),     unit: "/10" },
    { label: "Stress", value: fmtAvg(thirtyDay.map((c) => c.stress)),     unit: "/10" },
    { label: "Sleep",  value: thirtyDay.length ? fmtAvg(thirtyDay.map((c) => c.sleepHours)) : "—", unit: "hrs" },
  ];

  const patterns = [
    { label: "Top stress trigger",   insight: stressTrigger,   empty: "Still watching…"  },
    { label: "Top energy source",    insight: energySource,    empty: "Needs more data"   },
    { label: "Top happiness driver", insight: happinessDriver, empty: "Pending"            },
  ];

  return (
    <PageShell bg="/check-in-bg.PNG">
      <section className="mx-auto max-w-4xl px-5 py-10">
      <div className="rounded-[28px] px-6 py-10 md:px-10 md:py-12" style={{
        background: "rgba(251,244,239,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.65)",
        boxShadow: "0 24px 64px rgba(30,27,24,0.10), inset 0 1px 0 rgba(255,255,255,0.50)",
      }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {displayName
                ? <>{timeGreeting()}, {displayName}.</>
                : "Your patterns"}
            </h1>
            <p className="mt-2 text-muted">
              Analyzing {checkIns.length} check-ins · last 60 days
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!checkedInToday && (
              <Link
                href="/check-in"
                className="text-sm font-semibold text-indigo transition-opacity hover:opacity-70"
              >
                Check in today →
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
              <span className="font-semibold text-ink">{weekCheckIns.length}</span>
              <span className="text-muted">of 7 this week</span>
            </span>
          </div>
        </div>

        {/* ── Life Clarity Score ───────────────────────────────────────── */}
        {scores ? (
          <div className="mt-8 rounded-3xl bg-gradient-to-br from-ink to-[#1c1840] p-8 text-white shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Life Clarity Score
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-7xl font-bold leading-none">{scores.overall}</span>
                  <span className="mb-2.5 text-xl font-medium text-white/30">/100</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-white/50">
                  {clarityLabel(scores.overall)}
                </p>
                <p className="mt-1 text-xs text-white/30">
                  Based on {checkIns.length} check-ins · last 60 days
                </p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${RISK_STYLE[risk]}`}>
                {risk} burnout risk
              </span>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {(
                  [
                    { label: "Energy Clarity",      value: scores.energy },
                    { label: "Stress Clarity",       value: scores.stress },
                    { label: "Relationship Clarity", value: scores.relationship },
                    { label: "Happiness Clarity",    value: scores.happiness },
                  ] as const
                ).map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">{label}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-white/70 transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card mt-8 p-8">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lavender">
                <span className="text-xl font-bold text-indigo">{checkIns.length}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Building your baseline</p>
                <p className="mt-1 text-sm text-muted">
                  Life Clarity Score unlocks at 14 check-ins — {14 - checkIns.length} more to go.
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-1.5 rounded-full bg-indigo transition-all duration-500"
                    style={{ width: `${Math.round((checkIns.length / 14) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 30-day stats ─────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, unit }) => (
            <div
              key={label}
              className="card cursor-default p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(34,34,64,0.10)]"
            >
              <p className="text-xs font-medium text-muted">{label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                {value !== "—" && (
                  <span className="text-sm text-muted">{unit}</span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-muted/60">last 30 days</p>
            </div>
          ))}
        </div>

        {/* ── Pattern summary ───────────────────────────────────────────── */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {patterns.map(({ label, insight, empty }) => (
            <div
              key={label}
              className="card cursor-default p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(34,34,64,0.10)]"
            >
              <p className="text-xs font-medium text-muted">{label}</p>
              {insight ? (
                <>
                  <p className="mt-2 text-sm font-semibold leading-snug">{insight.title}</p>
                  <p
                    className="mt-1.5 line-clamp-2 text-xs text-muted"
                    title={insight.evidence[0]}
                  >
                    {insight.evidence[0]}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted/70">{empty}</p>
              )}
            </div>
          ))}
          <div className="card cursor-default p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(34,34,64,0.10)]">
            <p className="text-xs font-medium text-muted">Burnout risk</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLE[risk]}`}
            >
              {risk}
            </span>
            <p className="mt-2 text-xs text-muted">{RISK_DESC[risk]}</p>
          </div>
        </div>

        {/* ── Discovery feed ────────────────────────────────────────────── */}
        <div className="mt-12 border-t border-black/5 pt-8">
          <h2 className="text-2xl font-bold tracking-tight">What your data reveals</h2>
          <p className="mt-1 text-sm text-muted">
            Insights ranked by statistical confidence
          </p>
        </div>
        <div className="mt-5">
          {insights.length ? (
            <div className="space-y-4">
              {insights.map((i) => (
                <DiscoveryFeedItem key={i.id} insight={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-black/5 bg-white p-12 text-center">
              <p className="font-semibold">The engine hasn&apos;t found patterns yet.</p>
              <p className="mt-2 text-sm text-muted">
                Insights emerge after at least 14 consistent check-ins —
                you&apos;re {checkIns.length} of the way there.
              </p>
              <Link href="/check-in" className="btn-primary mt-6 inline-block">
                Check in today
              </Link>
            </div>
          )}
        </div>

      </div>{/* end glass panel */}
      </section>
    </PageShell>
  );
}
