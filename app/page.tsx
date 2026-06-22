import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";

const DISCOVERIES = [
  {
    category: "Energy",
    pillBg: "bg-amber",
    pillText: "text-amber-900",
    strength: "Strong pattern",
    title: "Exercise is your top energy source",
    evidence: "Observed across 14 of your last 30 check-ins",
    stat: "14",
    statLabel: "days observed",
  },
  {
    category: "Stress",
    pillBg: "bg-red-50",
    pillText: "text-red-700",
    strength: "Clear signal",
    title: "Meetings longer than 90 min trigger stress",
    evidence: "Seen in 6 of your 8 highest-stress days",
    stat: "6 / 8",
    statLabel: "highest-stress days",
  },
  {
    category: "Mood",
    pillBg: "bg-lavender",
    pillText: "text-indigo",
    strength: "Strong pattern",
    title: "Time with family = happier days",
    evidence: "Appeared in 4 of your 5 happiest days",
    stat: "4 / 5",
    statLabel: "happiest days",
  },
  {
    category: "Sleep",
    pillBg: "bg-sage",
    pillText: "text-green-800",
    strength: "Clearest signal",
    title: "7+ hours of sleep changes everything",
    evidence: "Days with 7+ hours showed 32% better mood",
    stat: "+32%",
    statLabel: "mood improvement",
  },
];

const FEATURES = [
  {
    icon: "🔒",
    title: "Private by default",
    body: "Your data belongs to you.",
  },
  {
    icon: "🧠",
    title: "AI that waits for evidence",
    body: "No guesses. Only patterns.",
  },
  {
    icon: "🌸",
    title: "Beautiful progress",
    body: "Grow your life garden.",
  },
  {
    icon: "📊",
    title: "Backed by science",
    body: "Behavioral & data driven.",
  },
];

const MILESTONES = [
  { day: "Day 1",   label: "Seed",           img: "/mascots/lucky-cat-seed.png" },
  { day: "Day 7",   label: "First Pattern",  img: "/mascots/lucky-cat-7.PNG"    },
  { day: "Day 30",  label: "Blooming",       img: "/mascots/lucky-cat-30.PNG"   },
  { day: "Day 100", label: "Wise Cat",       img: "/mascots/lucky-cat-100.PNG"  },
  { day: "Day 365", label: "Master Garden",  img: "/mascots/lucky-cat-365.PNG"  },
];

const STEPS = [
  {
    step: "01",
    title: "Check in — 30 seconds",
    body: "Mood, energy, sleep, stress, and more.",
  },
  {
    step: "02",
    title: "AI looks for patterns",
    body: "It waits for enough evidence.",
  },
  {
    step: "03",
    title: "Discoveries emerge",
    body: "Clear, actionable insights about you.",
  },
  {
    step: "04",
    title: "Life gets better",
    body: "Make better decisions. Every day.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">

          {/* Left: Copy */}
          <div>
            <span
              className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-sand px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold"
              style={{ animationDelay: "0.05s" }}
            >
              AI Pattern Discovery
            </span>
            <h1
              className="hero-in font-heading mt-4 text-5xl font-bold leading-[1.08] tracking-tight text-warm-ink md:text-6xl lg:text-[4.5rem]"
              style={{ animationDelay: "0.18s" }}
            >
              AI finds the<br />
              patterns.<br />
              <span className="italic text-gold">You live better.</span>
            </h1>
            <p
              className="hero-in mt-6 max-w-md text-lg leading-relaxed text-warm-muted"
              style={{ animationDelay: "0.32s" }}
            >
              30-second check-ins. Real discoveries.<br className="hidden md:block" />
              Better decisions. A life that feels like you.
            </p>
            <div
              className="hero-in mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.45s" }}
            >
              <Link href="/auth" className="lp-btn-primary">
                Start My First Check-in
              </Link>
              <Link href="/auth" className="lp-btn-secondary">
                See an Example
              </Link>
            </div>
            <p
              className="hero-in mt-5 text-sm text-warm-muted"
              style={{ animationDelay: "0.58s" }}
            >
              12,431+ people discovering patterns in their everyday lives
            </p>
          </div>

          {/* Right: Visual */}
          <div
            className="hero-in relative"
            style={{ animationDelay: "0.25s" }}
          >
            {/* Garden container */}
            <div
              className="relative overflow-hidden rounded-[2.5rem]"
              style={{
                background: "linear-gradient(155deg, #FBF4EF 0%, #F2E5D2 55%, #E8D3B8 100%)",
                minHeight: "460px",
              }}
            >
              {/* Decorative sakura petals */}
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {[
                  { top: "9%",  left: "11%", w: 11, h: 7,  rot: -35, op: 0.30 },
                  { top: "14%", left: "76%", w: 8,  h: 5,  rot:  22, op: 0.22 },
                  { top: "30%", left: "86%", w: 10, h: 6,  rot: -12, op: 0.26 },
                  { top: "70%", left: "7%",  w: 9,  h: 6,  rot:  48, op: 0.24 },
                  { top: "80%", left: "82%", w: 7,  h: 4,  rot: -52, op: 0.20 },
                  { top: "50%", left: "90%", w: 6,  h: 4,  rot:  15, op: 0.18 },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute block rounded-full"
                    style={{
                      top: p.top, left: p.left,
                      width: p.w, height: p.h,
                      background: "#E8A87C",
                      opacity: p.op,
                      transform: `rotate(${p.rot}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Main mascot — sakura garden cat */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascots/lucky-cat-sakura.PNG"
                alt="Lucky cat in a sakura garden"
                className="relative mx-auto block w-full max-w-[340px] object-contain pt-10 md:max-w-[380px]"
              />

              {/* Discovery card — floats over bottom-left of image */}
              <div className="absolute bottom-4 left-4 z-10 rounded-2xl bg-white px-4 py-3.5 shadow-gold">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  ✦ New Discovery
                </p>
                <p className="mt-1 text-sm font-semibold text-warm-ink">Sleep &gt; 7h</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-warm-ink">
                  Mood +34%
                </p>
                <p className="mt-0.5 text-xs text-warm-muted">Confidence 87%</p>
              </div>
            </div>

            {/* Greeting cat — floats outside top-right */}
            <div className="absolute -right-3 -top-3 z-10 rounded-2xl bg-white p-2 shadow-gold md:-right-5 md:-top-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascots/lucky-cat-greeting.PNG"
                alt="Lucky cat waving"
                className="h-16 w-16 object-contain md:h-20 md:w-20"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature strip ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div
          className="reveal rounded-[2rem] border bg-white px-8 py-8"
          style={{ borderColor: "#E8DDD2" }}
        >
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={[
                  "flex flex-col gap-2 md:px-8",
                  i === 0 ? "md:pl-0" : "",
                  i === FEATURES.length - 1 ? "md:pr-0" : "md:border-r",
                ].join(" ")}
                style={i < FEATURES.length - 1 ? { borderColor: "#E8DDD2" } : undefined}
              >
                <div
                  className="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-base"
                  style={{ background: "#FBF4EF" }}
                >
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-warm-ink">{f.title}</p>
                <p className="text-xs leading-relaxed text-warm-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discoveries ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Discoveries
            </p>
            <h2 className="reveal font-heading text-4xl font-bold leading-tight tracking-tight text-warm-ink md:text-5xl">
              Discover what<br className="hidden md:block" /> actually matters
            </h2>
          </div>
          <Link
            href="/auth"
            className="reveal lp-btn-secondary shrink-0 self-start md:self-auto"
          >
            Explore more discoveries
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVERIES.map((d, i) => (
            <div
              key={d.category}
              className="card reveal group flex flex-col gap-0 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(182,138,90,0.14)]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${d.pillBg} ${d.pillText}`}>
                  {d.category}
                </span>
                <span className="text-xs text-warm-muted">{d.strength}</span>
              </div>

              <h3 className="font-heading mt-4 text-lg font-semibold leading-snug text-warm-ink">
                {d.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-warm-muted">{d.evidence}</p>

              <div className="mt-5 border-t pt-4" style={{ borderColor: "#E8DDD2" }}>
                <p className="text-2xl font-bold tracking-tight text-warm-ink">{d.stat}</p>
                <p className="mt-0.5 text-xs text-warm-muted">{d.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Garden Progress ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#F5EDE4" }}>
        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <div className="reveal mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Your Garden
            </p>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-warm-ink md:text-5xl">
              Grow your inner garden
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-warm-muted">
              Consistency helps your garden grow — and reveals deeper insights about you.
            </p>
          </div>

          {/* Timeline — scrollable on mobile */}
          <div className="reveal -mx-6 overflow-x-auto px-6 pb-4 md:overflow-visible md:pb-0">
            <div className="relative flex min-w-[700px] md:min-w-0">

              {/* Connecting thread */}
              <div
                aria-hidden
                className="absolute top-[72px] hidden border-t-2 border-dashed md:block"
                style={{ left: "10%", right: "10%", borderColor: "#E8DDD2" }}
              />

              {MILESTONES.map((m) => (
                <div key={m.day} className="flex flex-1 flex-col items-center gap-3 px-3">

                  {/* Mascot card */}
                  <div
                    className="relative z-10 flex h-36 w-36 items-end justify-center overflow-hidden rounded-[1.25rem] border bg-white"
                    style={{ borderColor: "#E8DDD2" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.img}
                      alt={m.label}
                      className="h-full w-full object-contain object-bottom"
                    />
                  </div>

                  {/* Day pill */}
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-bold"
                    style={{ borderColor: "#E8DDD2", background: "white", color: "#B68A5A" }}
                  >
                    {m.day}
                  </span>

                  {/* Milestone label */}
                  <p className="text-center text-sm font-semibold text-warm-ink">{m.label}</p>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          The process
        </p>
        <h2 className="reveal font-heading mb-14 text-4xl font-bold tracking-tight text-warm-ink md:text-5xl">
          How LifePattern works
        </h2>

        <div className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          {/* Connecting thread — desktop only */}
          <div
            aria-hidden
            className="absolute top-5 hidden border-t border-dashed md:block"
            style={{ left: "calc(12.5% + 1.25rem)", right: "calc(12.5% + 1.25rem)", borderColor: "#E8DDD2" }}
          />
          {STEPS.map(({ step, title, body }, i) => (
            <div
              key={step}
              className="reveal relative flex flex-col gap-4"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "#B68A5A" }}
              >
                {step}
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-warm-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-warm-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div
          className="reveal relative overflow-hidden rounded-[2.5rem] px-10 py-20 text-center md:px-20 md:py-28"
          style={{
            background: "linear-gradient(160deg, #2C1A0E 0%, #1E1B18 45%, #0F1A12 100%)",
          }}
        >
          {/* Subtle warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(182,138,90,0.18) 0%, transparent 70%)",
            }}
          />

          <p className="relative mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Begin your journey
          </p>
          <h2
            className="relative font-heading text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Your story is already<br className="hidden md:block" /> unfolding.
          </h2>
          <p className="relative mt-4 text-xl font-light text-white/60 md:text-2xl">
            Let&apos;s read it together.
          </p>

          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth"
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: "#B68A5A" }}
            >
              Start Free — No Card Needed
            </Link>
            <Link
              href="/auth"
              className="rounded-full border px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              See an Example
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #E8DDD2" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-warm-muted">
          <span className="font-semibold text-warm-ink">LifePattern</span>
          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="transition hover:text-warm-ink">Privacy</Link>
            <Link href="/privacy" className="transition hover:text-warm-ink">Terms</Link>
            <Link href="/auth" className="transition hover:text-warm-ink">Help</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
