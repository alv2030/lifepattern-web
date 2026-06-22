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
      <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>

        {/* Immersive artwork — bleeds to viewport edge, desktop only */}
        <div className="absolute inset-y-0 right-0 hidden w-[57%] md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascots/lucky-cat-hero.png"
            alt="Lucky cat in a Japanese garden with sakura tree, koi pond, and stone lantern"
            className="h-full w-full object-cover object-center"
          />
          {/* Gradient fade into page background */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-3/4"
            style={{
              background:
                "linear-gradient(to right, #FDFAF8 0%, #FDFAF8 6%, rgba(253,250,248,0.88) 30%, rgba(253,250,248,0.25) 65%, transparent 100%)",
            }}
          />
          {/* Bottom vignette */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{ background: "linear-gradient(to top, #FDFAF8, transparent)" }}
          />
        </div>

        {/* Discovery card — floats over image, desktop */}
        <div
          className="absolute bottom-14 z-20 hidden max-w-[240px] rounded-2xl bg-white/90 px-5 py-4 backdrop-blur-sm md:block"
          style={{
            right: "9%",
            boxShadow: "0 20px 60px rgba(182,138,90,0.20), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <p className="font-heading text-[11px] italic text-warm-muted">
            I&apos;ve noticed something.
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-warm-ink">
            On days you sleep 7+ hours,<br />
            your mood improves by{" "}
            <span className="font-bold text-gold">34%</span>.
          </p>
          <div className="mt-3 border-t pt-2.5" style={{ borderColor: "#E8DDD2" }}>
            <p className="text-[11px] text-warm-muted">Confidence 87%</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 md:pb-24 md:pt-28">
          <div className="max-w-[520px]">

            {/* Badge */}
            <div
              className="hero-in mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ borderColor: "#E8DDD2", color: "#B68A5A", animationDelay: "0.05s" }}
            >
              Personal Pattern Discovery
            </div>

            {/* Headline */}
            <h1
              className="hero-in font-heading text-[2.6rem] font-bold leading-[1.08] tracking-tight text-warm-ink md:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: "0.15s" }}
            >
              Your life is already<br />
              <span className="italic text-gold">telling</span> a story.
              <span className="mt-4 block">
                LifePattern helps you<br />
                <span className="italic text-gold">read</span> it.
              </span>
            </h1>

            {/* Supporting statement */}
            <p
              className="hero-in mt-8 text-lg font-medium leading-relaxed text-warm-ink"
              style={{ animationDelay: "0.28s" }}
            >
              Your best days have something in common.<br className="hidden md:block" />
              So do your worst ones.
            </p>

            {/* Body copy */}
            <p
              className="hero-in mt-3 max-w-sm text-base leading-relaxed text-warm-muted"
              style={{ animationDelay: "0.36s" }}
            >
              Small moments leave clues. LifePattern helps you discover the people,
              habits, places, and routines quietly shaping your life.
            </p>

            {/* CTAs */}
            <div
              className="hero-in mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "0.46s" }}
            >
              <Link href="/auth" className="lp-btn-primary">
                Start My First Check-in
              </Link>
              <Link href="/auth" className="lp-btn-secondary">
                See an Example
              </Link>
            </div>

            {/* Social proof */}
            <p
              className="hero-in mt-5 text-sm text-warm-muted"
              style={{ animationDelay: "0.56s" }}
            >
              12,431+ people discovering patterns in their everyday lives
            </p>

            {/* Mobile: hero image */}
            <div className="relative mt-10 md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascots/lucky-cat-hero.png"
                alt="Lucky cat in a Japanese garden"
                className="w-full rounded-2xl object-cover"
                style={{ height: "300px" }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-2xl"
                style={{ background: "linear-gradient(to top, #FDFAF8, transparent)" }}
              />
              {/* Mobile discovery card */}
              <div
                className="absolute bottom-4 left-3 max-w-[200px] rounded-xl bg-white/90 px-4 py-3 backdrop-blur-sm"
                style={{ boxShadow: "0 8px 32px rgba(182,138,90,0.18)" }}
              >
                <p className="font-heading text-[10px] italic text-warm-muted">
                  I&apos;ve noticed something.
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-warm-ink">
                  On days you sleep 7+ hours, your mood improves by{" "}
                  <span className="font-bold text-gold">34%</span>.
                </p>
                <p className="mt-1.5 text-[10px] text-warm-muted">Confidence 87%</p>
              </div>
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
