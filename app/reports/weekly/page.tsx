import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { InsightCard } from "@/components/insight-card";
import { generateInsights } from "@/lib/discovery-engine";
import { getCheckIns, isoDateDaysAgo } from "@/lib/data";

export default async function WeeklyReport() {
  const weekFrom = isoDateDaysAgo(6);
  const today = new Date().toISOString().slice(0, 10);

  // Use last 30 days for insight generation (needs ≥5 check-ins)
  const allCheckIns = await getCheckIns({ from: isoDateDaysAgo(30) });
  const weekCheckIns = allCheckIns.filter((c) => c.date >= weekFrom);
  const insights = generateInsights(allCheckIns);

  const range = weekCheckIns.length
    ? `${weekCheckIns[weekCheckIns.length - 1].date} — ${weekCheckIns[0].date}`
    : `${weekFrom} — ${today}`;

  if (!weekCheckIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-5xl px-6 py-14">
          <h1 className="text-4xl font-bold tracking-tight">Weekly Discovery Report</h1>
          <p className="mt-3 text-muted">{range}</p>
          <div className="card mt-12 flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-lg text-muted">No check-ins this week yet. Start now and your patterns will appear here.</p>
            <Link href="/check-in" className="btn-primary">Check in today</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Discovery Report</h1>
        <p className="mt-3 text-muted">{range}</p>

        {insights.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {insights.map((i) => <InsightCard key={i.id} insight={i} />)}
          </div>
        ) : (
          <div className="card mt-8 p-10 text-center">
            <p className="text-muted">
              {allCheckIns.length < 5
                ? `You have ${allCheckIns.length} check-in${allCheckIns.length === 1 ? "" : "s"} — discoveries appear after 5 or more days of data.`
                : "No patterns detected yet. Keep going!"}
            </p>
            <Link href="/check-in" className="btn-primary mt-6 inline-block">Check in today</Link>
          </div>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: "Check-ins this week", value: weekCheckIns.length },
            { label: "Avg mood", value: weekCheckIns.length ? (weekCheckIns.reduce((s, c) => s + c.mood, 0) / weekCheckIns.length).toFixed(1) : "—" },
            { label: "Avg energy", value: weekCheckIns.length ? (weekCheckIns.reduce((s, c) => s + c.energy, 0) / weekCheckIns.length).toFixed(1) : "—" },
          ].map(({ label, value }) => (
            <div className="card p-6" key={label}>
              <div className="text-sm text-muted">{label}</div>
              <div className="mt-2 text-4xl font-bold">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
