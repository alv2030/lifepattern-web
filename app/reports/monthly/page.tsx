import { PageShell } from "@/components/page-shell";
import { sampleCheckIns } from "@/lib/mock-data";
import { generateInsights } from "@/lib/discovery-engine";

function avg(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clarityScore(mood: number, energy: number, stress: number) {
  return Math.round(((mood / 10) + (energy / 10) + ((10 - stress) / 10)) / 3 * 100);
}

export default function MonthlyReport() {
  const checkIns = sampleCheckIns;
  const moodAvg = avg(checkIns.map((c) => c.mood));
  const energyAvg = avg(checkIns.map((c) => c.energy));
  const stressAvg = avg(checkIns.map((c) => c.stress));
  const sleepAvg = avg(checkIns.map((c) => c.sleepHours));
  const score = clarityScore(moodAvg, energyAvg, stressAvg);
  const insights = generateInsights(checkIns);
  const energyInsight = insights.find((i) => i.type === "energy");
  const stressInsight = insights.find((i) => i.type === "stress");

  const month = new Date(checkIns[0].date).toLocaleString("default", { month: "long", year: "numeric" });

  const categories = [
    {
      title: "Energy Clarity",
      score: Math.round(energyAvg * 10),
      body: energyInsight ? energyInsight.summary : `Average energy: ${energyAvg.toFixed(1)} / 10.`,
    },
    {
      title: "Stress Clarity",
      score: Math.round((10 - stressAvg) * 10),
      body: stressInsight ? stressInsight.summary : `Average stress: ${stressAvg.toFixed(1)} / 10.`,
    },
    {
      title: "Sleep Clarity",
      score: Math.round(Math.min(sleepAvg / 8, 1) * 100),
      body: `Average sleep: ${sleepAvg.toFixed(1)} hours.`,
    },
    {
      title: "Mood Clarity",
      score: Math.round(moodAvg * 10),
      body: `Average mood: ${moodAvg.toFixed(1)} / 10.`,
    },
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="card bg-ink p-10 text-white">
          <div className="text-white/60">{month}</div>
          <h1 className="mt-3 text-5xl font-bold tracking-tight">Life Clarity Report</h1>
          <div className="mt-8 text-7xl font-bold">{score}</div>
          <div className="mt-2 text-white/70">Life Clarity Score</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {categories.map(({ title, score: s, body }) => (
            <div className="card p-6" key={title}>
              <div className="text-muted">{title}</div>
              <div className="mt-2 text-5xl font-bold">{s}</div>
              <p className="mt-3 text-muted">{body}</p>
            </div>
          ))}
        </div>
        <div className="card mt-8 p-8">
          <h2 className="text-2xl font-bold">The one thing you should know</h2>
          <p className="mt-4 text-xl leading-8 text-muted">
            {energyInsight
              ? energyInsight.reflection
              : "Your patterns are still emerging. Keep checking in for personalised discoveries."}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
