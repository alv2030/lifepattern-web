import { PageShell } from "@/components/page-shell";

export default function WeeklyReport() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Discovery Report</h1>
        <p className="mt-3 text-muted">A calm summary of what stood out this week.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {["Biggest stress trigger: Meetings", "Biggest energy source: Exercise", "Best day formula: Sleep + Gym + Friends", "Hidden discovery: Outdoor time appeared in your best days"].map((x) => <div className="card p-6 text-xl font-semibold" key={x}>{x}</div>)}
        </div>
      </section>
    </PageShell>
  );
}
