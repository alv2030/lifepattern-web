import { PageShell } from "@/components/page-shell";

export default function Privacy() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Center</h1>
        <p className="mt-4 text-lg text-muted">LifePattern is designed around the idea that your inner life belongs to you.</p>
        <div className="mt-8 space-y-5">
          {[
            ["Data ownership", "You own your check-ins, insights, and reports."],
            ["No training promise", "Your private entries should not be used to train AI models."],
            ["Export data", "Download your data as JSON or CSV."],
            ["Delete data", "Delete your account and data permanently."],
            ["AI usage", "AI is used to explain evidence-backed patterns, not to diagnose or provide medical advice."]
          ].map(([t, b]) => <div className="card p-6" key={t}><h2 className="text-xl font-semibold">{t}</h2><p className="mt-2 text-muted">{b}</p></div>)}
        </div>
      </section>
    </PageShell>
  );
}
