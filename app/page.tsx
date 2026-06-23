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
    img: "/mascots/lucky-cat-energy.PNG",
  },
  {
    category: "Stress",
    pillBg: "bg-red-50",
    pillText: "text-red-700",
    strength: "Clear signal",
    title: "Meetings longer than 90 min trigger stress",
    evidence: "Seen in 6 of your highest-stress days",
    img: "/mascots/lucky-cat-stress.PNG",
  },
  {
    category: "Mood",
    pillBg: "bg-lavender",
    pillText: "text-indigo",
    strength: "Strong pattern",
    title: "Time with family = happier days",
    evidence: "Appeared in 4 of your happiest days",
    img: "/mascots/lucky-cat-mood.PNG",
  },
  {
    category: "Sleep",
    pillBg: "bg-sage",
    pillText: "text-green-800",
    strength: "Clearest signal",
    title: "7+ hours of sleep changes everything",
    evidence: "Days with 7+ hours showed better mood",
    img: "/mascots/lucky-cat-sleep.PNG",
  },
];

const FEATURES = [
  {
    img: "/features/feature-private.PNG",
    title: "Private by default",
    body: "Your data belongs to you. Never sold, never shared.",
  },
  {
    img: "/features/feature-ai.PNG",
    title: "AI that waits for evidence",
    body: "No guesses. Patterns only surface when the data supports them.",
  },
  {
    img: "/features/feature-gadern.PNG",
    title: "Beautiful progress",
    body: "Watch your life garden grow with every check-in.",
  },
  {
    img: "/features/feature-data.PNG",
    title: "Backed by science",
    body: "Built on behavioral psychology and data science.",
  },
];

const MILESTONES = [
  { day: "Day 1",   label: "Seed",           img: "/mascots/garden-seed.PNG"    },
  { day: "Day 7",   label: "First Pattern",  img: "/mascots/garden-day-7.PNG"   },
  { day: "Day 30",  label: "Blooming",       img: "/mascots/garden-day-30.PNG"  },
  { day: "Day 100", label: "Wise Cat",       img: "/mascots/garden-day-100.PNG" },
  { day: "Day 365", label: "Master Garden",  img: "/mascots/garden-day-365.PNG" },
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
      <section className="relative overflow-hidden md:flex md:items-center" style={{ minHeight: "92vh" }}>

        {/* Immersive artwork — bleeds to viewport edge, desktop only */}
        <div className="absolute inset-y-0 right-0 hidden w-[57%] md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascots/lucky-cat-hero.png"
            alt="Lucky cat in a Japanese garden with sakura tree, koi pond, and stone lantern"
            className="h-full w-full object-cover"
            style={{ objectPosition: "40% center" }}
          />
          {/* Gradient fade into page background */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-3/4"
            style={{
              background:
                "linear-gradient(to right, #FDFAF8 0%, #FDFAF8 6%, rgba(253,250,248,0.85) 28%, rgba(253,250,248,0.2) 60%, transparent 100%)",
            }}
          />
          {/* Bottom vignette */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
            style={{ background: "linear-gradient(to top, #FDFAF8 15%, transparent)" }}
          />
        </div>

        {/* Discovery card — floats over image, desktop */}
        <div
          className="absolute z-20 hidden md:block"
          style={{ bottom: "22%", right: "8%" }}
        >
          <div
            className="w-[228px] overflow-hidden rounded-2xl bg-white"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)" }}
          >
            {/* Gold top stripe */}
            <div
              className="h-[3px]"
              style={{ background: "linear-gradient(to right, #C4963E 0%, rgba(196,150,62,0.15) 100%)" }}
            />
            <div className="px-5 py-4">
              {/* Label */}
              <p className="font-heading text-[10px] italic" style={{ color: "#B68A5A" }}>
                I&apos;ve noticed something.
              </p>
              {/* Insight */}
              <p className="mt-2.5 text-[0.8125rem] leading-snug text-warm-ink">
                On days you sleep 7+ hours, your mood improves by{" "}
                <span className="font-bold" style={{ color: "#C4963E" }}>34%</span>.
              </p>
              {/* Confidence row */}
              <div className="mt-3.5 border-t pt-3" style={{ borderColor: "#EDE6DE" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[10.5px] text-warm-muted">Confidence</p>
                  <p className="text-[10.5px] font-semibold text-warm-ink">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-8">
          <div className="max-w-[560px]">

            {/* Editorial eyebrow */}
            <div
              className="hero-in mb-10 flex items-center gap-3"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="h-px w-8 flex-shrink-0" style={{ background: "#B68A5A" }} />
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: "#B68A5A" }}
              >
                Personal Pattern Discovery
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-in font-heading text-[2.75rem] font-bold leading-[1.04] tracking-tight text-warm-ink md:text-[3.25rem] lg:text-[4.75rem] lg:leading-[1.0]"
              style={{ animationDelay: "0.15s" }}
            >
              Your life is already<br />
              <span className="italic" style={{ color: "#C4963E" }}>telling</span> a story.
              <span className="mt-6 block">
                LifePattern helps you{" "}
                <br className="hidden md:block" />
                <span className="italic" style={{ color: "#C4963E" }}>read</span> it.
              </span>
            </h1>

            {/* Supporting statement */}
            <p
              className="hero-in mt-11 text-xl leading-[1.5] text-warm-ink"
              style={{ animationDelay: "0.28s" }}
            >
              Your best days have something in common.{" "}
              So do your worst ones.
            </p>

            {/* Body copy */}
            <p
              className="hero-in mt-4 max-w-[400px] text-[0.9375rem] leading-relaxed tracking-[0.01em] text-warm-muted"
              style={{ animationDelay: "0.36s" }}
            >
              Small moments leave clues. LifePattern helps you discover the people,
              habits, places, and routines quietly shaping your life.
            </p>

            {/* CTAs */}
            <div
              className="hero-in mt-10 flex flex-wrap gap-3"
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
              className="hero-in mt-5 text-xs tracking-[0.04em] text-warm-muted"
              style={{ animationDelay: "0.56s" }}
            >
              12,431+ people discovering patterns in their everyday lives
            </p>

            {/* Mobile: hero image */}
            <div className="relative mt-12 md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascots/lucky-cat-hero.png"
                alt="Lucky cat in a Japanese garden"
                className="w-full rounded-2xl object-cover"
                style={{ height: "320px", objectPosition: "40% center" }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-2xl"
                style={{ background: "linear-gradient(to top, #FDFAF8, transparent)" }}
              />
              {/* Mobile discovery card */}
              <div
                className="absolute bottom-4 left-3 w-[190px] overflow-hidden rounded-xl bg-white"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.09)" }}
              >
                <div className="h-[2.5px]" style={{ background: "linear-gradient(to right, #C4963E, rgba(196,150,62,0.15))" }} />
                <div className="px-3.5 py-3">
                  <p className="font-heading text-[9px] italic" style={{ color: "#B68A5A" }}>
                    I&apos;ve noticed something.
                  </p>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-warm-ink">
                    On days you sleep 7+ hours, your mood improves by{" "}
                    <span className="font-bold" style={{ color: "#C4963E" }}>34%</span>.
                  </p>
                  <div className="mt-2.5 border-t pt-2" style={{ borderColor: "#EDE6DE" }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-warm-muted">Confidence</p>
                      <p className="text-[9px] font-semibold text-warm-ink">87%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ── Feature strip ────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 md:px-6">
        <div
          className="reveal mx-auto overflow-hidden bg-white"
          style={{
            maxWidth: "1440px",
            borderRadius: "36px",
            border: "1px solid rgba(232, 221, 210, 0.6)",
            boxShadow: "0 18px 50px rgba(30, 27, 24, 0.06)",
          }}
        >
          {/* 2-col on mobile/tablet, 4-col on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f, i) => {
              // mobile 2×2: 0→right+bottom, 1→bottom, 2→right, 3→none
              // desktop 4×1: 0,1,2→right, 3→none (remove bottom)
              const borderClass = [
                "border-r border-b md:border-b-0",
                "border-b md:border-b-0 md:border-r",
                "border-r md:border-r",
                "",
              ][i];
              return (
                <div
                  key={f.title}
                  className={`group flex flex-col items-center px-4 py-3 text-center transition-transform duration-300 ease-out hover:-translate-y-[4px] md:px-8 md:py-3 ${borderClass}`}
                  style={{ borderColor: "rgba(182, 138, 90, 0.18)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={f.title}
                    className="h-[140px] w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] md:h-[224px]"
                    style={{
                      display: "block",
                      filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.09))",
                    }}
                  />
                  <h3
                    className="-mt-4 font-heading font-semibold leading-tight text-[13px] md:-mt-[55px] md:text-[20px]"
                    style={{ color: "#1E1B18" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="mx-auto text-[11px] md:text-[13px]"
                    style={{ color: "#6F675F", fontWeight: 300, lineHeight: "1.45", maxWidth: "200px", marginTop: "6px" }}
                  >
                    {f.body}
                  </p>
                </div>
              );
            })}
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
              {/* Mascot — full-bleed to card top edge */}
              <div
                className="-mx-6 -mt-6 mb-6 flex h-[200px] items-end justify-center overflow-hidden rounded-t-3xl"
                style={{ background: "rgba(232, 221, 210, 0.22)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.img}
                  alt={d.category}
                  className="h-[95%] w-auto object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${d.pillBg} ${d.pillText}`}>
                  {d.category}
                </span>
                <span className="text-xs text-warm-muted">{d.strength}</span>
              </div>

              <h3 className="font-heading mt-5 text-lg font-semibold leading-snug text-warm-ink">
                {d.title}
              </h3>

              <p className="mt-3 pb-2 text-sm leading-relaxed text-warm-muted">{d.evidence}</p>
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
            <div className="relative flex min-w-[1100px] md:min-w-0">

              {/* Connecting journey line */}
              <div
                aria-hidden
                className="absolute hidden md:block"
                style={{
                  top: "100px",
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(182,138,90,0.3) 8%, rgba(182,138,90,0.3) 92%, transparent 100%)",
                }}
              />
              {/* Directional chevrons between stages */}
              {[20, 40, 60, 80].map((pct) => (
                <div
                  key={pct}
                  aria-hidden
                  className="absolute hidden md:flex items-center justify-center"
                  style={{ top: "91px", left: `${pct}%`, transform: "translateX(-50%)", zIndex: 5 }}
                >
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                    <path d="M1.5 1.5L7 7l-5.5 5.5" stroke="rgba(182,138,90,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}

              {MILESTONES.map((m) => (
                <div key={m.day} className="group flex flex-1 flex-col items-center gap-4 px-3">

                  {/* Mascot card */}
                  <div
                    className="relative z-10 flex h-[200px] w-[200px] items-end justify-center overflow-hidden rounded-[1.5rem] border border-sand bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-[280ms] ease-out hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(182,138,90,0.14)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.img}
                      alt={m.label}
                      className="h-full w-full object-contain object-bottom transition-transform duration-[280ms] ease-out group-hover:scale-[1.04]"
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
