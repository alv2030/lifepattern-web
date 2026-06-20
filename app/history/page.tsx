import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getCheckIns } from "@/lib/data";

function scoreColor(value: number, invert = false) {
  const high = invert ? value <= 4 : value >= 7;
  const low = invert ? value >= 7 : value <= 4;
  if (high) return "text-green-600";
  if (low) return "text-red-500";
  return "text-amber-600";
}

function fmt(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export default async function History() {
  const checkIns = await getCheckIns();

  if (!checkIns.length) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Check-in history</h1>
          <div className="card mt-12 flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-lg text-muted">No check-ins yet. Your history will appear here once you start.</p>
            <Link href="/check-in" className="btn-primary">Do your first check-in</Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Check-in history</h1>
          <span className="pill">{checkIns.length} total</span>
        </div>
        <div className="mt-8 space-y-4">
          {checkIns.map((c) => (
            <div key={c.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-semibold">{fmt(c.date)}</span>
                <div className="flex gap-4 text-sm">
                  <span>Mood <span className={`font-bold ${scoreColor(c.mood)}`}>{c.mood}</span></span>
                  <span>Energy <span className={`font-bold ${scoreColor(c.energy)}`}>{c.energy}</span></span>
                  <span>Stress <span className={`font-bold ${scoreColor(c.stress, true)}`}>{c.stress}</span></span>
                  <span className="text-muted">{c.sleepHours}h sleep</span>
                </div>
              </div>
              {c.activities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.activities.map((a) => (
                    <span key={a} className="rounded-full bg-lavender px-3 py-1 text-xs font-medium text-indigo">{a}</span>
                  ))}
                  {c.people.map((p) => (
                    <span key={p} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-muted">{p}</span>
                  ))}
                </div>
              )}
              {c.note && <p className="mt-3 text-sm text-muted">{c.note}</p>}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
