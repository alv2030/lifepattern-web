import Link from "next/link";
import { Nav } from "@/components/nav";

const INSIGHTS = [
  {
    type: "Energy",
    typeBg: "bg-amber text-amber-900",
    confidence: "Strong pattern",
    title: "Exercise is your top energy source",
    withLabel: "Exercise days",
    withVal: "7.8",
    withoutLabel: "Rest days",
    withoutVal: "5.1",
    evidence: "Observed across 14 of your last 30 check-ins",
  },
  {
    type: "Stress",
    typeBg: "bg-red-50 text-red-700",
    confidence: "Possible pattern",
    title: "Work meetings correlate with stress peaks",
    withLabel: "Meeting days",
    withVal: "7.2",
    withoutLabel: "Other days",
    withoutVal: "4.6",
    evidence: "Seen in 18 of 24 high-stress days",
  },
  {
    type: "Mood",
    typeBg: "bg-lavender text-indigo",
    confidence: "Strong pattern",
    title: "7+ hours of sleep predicts better mood",
    withLabel: "Good sleep",
    withVal: "8.3",
    withoutLabel: "Less sleep",
    withoutVal: "5.7",
    evidence: "Your clearest signal — 22 data points",
  },
];

const STEPS = [
  {
    step: "01",
    title: "30-second check-in",
    body: "Mood, energy, stress, sleep, who you were with, what you did. That's it.",
  },
  {
    step: "02",
    title: "Patterns emerge",
    body: "After 5–14 days, the engine starts detecting what conditions shape your best and worst states.",
  },
  {
    step: "03",
    title: "Evidence-backed discoveries",
    body: "Not guesses. Each insight shows the data behind it so you can decide what to do.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mist">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-28">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Private personal insight platform
          </p>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-ink md:text-7xl lg:text-8xl">
            The pattern<br />
            was there.<br />
            You just couldn&apos;t{" "}
            <em className="font-display font-normal not-italic">
              <span className="italic">see</span>
            </em>{" "}
            it.
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-muted">
            LifePattern turns 30-second daily check-ins into evidence-backed
            discoveries about what energises you, drains you, and keeps repeating.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/auth" className="btn-primary text-base">
              Start free — no card needed
            </Link>
            <Link href="/auth" className="btn-secondary text-base">
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted">
            Most users see their first pattern within 7 days.
          </p>
        </div>
      </section>

      {/* ── Insight cards ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-8 text-sm font-semibold text-muted">
          What discoveries look like
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {INSIGHTS.map((ins) => (
            <div
              key={ins.type}
              className="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(34,34,64,0.14)]"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ins.typeBg}`}>
                  {ins.type}
                </span>
                <span className="text-xs text-muted">{ins.confidence}</span>
              </div>

              <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">
                {ins.title}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-mist p-3">
                  <p className="text-xs text-muted">{ins.withLabel}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">{ins.withVal}</p>
                </div>
                <div className="rounded-2xl bg-mist p-3">
                  <p className="text-xs text-muted">{ins.withoutLabel}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-muted">{ins.withoutVal}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted">{ins.evidence}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          How it works
        </p>
        <div className="relative grid gap-10 md:grid-cols-3">
          {/* connecting thread — desktop only */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-5 hidden border-t border-dashed border-black/10 md:block"
            style={{ left: "calc(16.67% + 1rem)", right: "calc(16.67% + 1rem)" }}
          />
          {STEPS.map(({ step, title, body }) => (
            <div key={step} className="relative flex flex-col gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {step}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-8 pb-24">
        <div className="rounded-[2rem] bg-ink px-10 py-14 text-white md:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Privacy
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Your inner life belongs to you.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            Private by default. Export your data anytime. Delete everything
            permanently in one tap. Your journal and life data should never
            become someone else&apos;s training data.
          </p>
          <Link
            href="/auth"
            className="mt-8 inline-block rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-muted">
          <span>© 2026 LifePattern</span>
          <Link href="/privacy" className="transition hover:text-ink">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
