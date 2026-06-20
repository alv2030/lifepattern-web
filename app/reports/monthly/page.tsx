import { PageShell } from "@/components/page-shell";

export default function MonthlyReport() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="card bg-ink p-10 text-white">
          <div className="text-white/60">June 2026</div>
          <h1 className="mt-3 text-5xl font-bold tracking-tight">Life Clarity Report</h1>
          <div className="mt-8 text-7xl font-bold">72</div>
          <div className="mt-2 text-white/70">Life Clarity Score — Intentional</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ["Energy Clarity", "82", "Top source: Exercise. Top drain: meetings."],
            ["Stress Clarity", "74", "Stress spikes followed short sleep and work uncertainty."],
            ["Relationship Clarity", "68", "Friends and family appeared in your best days."],
            ["Direction Clarity", "45", "You mention achievement often, but meaning less often."]
          ].map(([t, s, b]) => <div className="card p-6" key={t}><div className="text-muted">{t}</div><div className="mt-2 text-5xl font-bold">{s}</div><p className="mt-3 text-muted">{b}</p></div>)}
        </div>
        <div className="card mt-8 p-8"><h2 className="text-2xl font-bold">The one thing you should know</h2><p className="mt-4 text-xl leading-8 text-muted">Your happiest days were not your most productive days. They were the days with sleep, movement, and meaningful conversations.</p></div>
      </section>
    </PageShell>
  );
}
