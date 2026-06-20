import Link from "next/link";
import { PageShell } from "@/components/page-shell";

const previews = [
  "Meetings appeared in 6 of your 8 highest-stress days.",
  "Exercise appeared in most of your highest-energy days.",
  "Your happiest days usually followed 7+ hours of sleep."
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_.9fr] md:py-24">
        <div>
          <div className="pill mb-6 inline-flex">Private personal insight platform</div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">Understand yourself through patterns.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">LifePattern helps you discover what drains you, what energizes you, and what keeps repeating — in just 30 seconds a day.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/onboarding" className="btn-primary">Start Your First Check-In</Link>
            <Link href="/dashboard" className="btn-secondary">See Demo Dashboard</Link>
          </div>
        </div>
        <div className="card p-6">
          <div className="mb-6 text-sm font-semibold text-muted">Example discoveries</div>
          <div className="space-y-4">
            {previews.map((p) => <div key={p} className="rounded-2xl bg-mist p-5 text-lg font-semibold">{p}</div>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["1", "30-second check-in", "Mood, energy, stress, sleep, people, activities, and one sentence."],
            ["2", "Pattern detection", "The system compares your daily context against stress, energy, and mood."],
            ["3", "Weekly discoveries", "You get evidence-backed discoveries instead of generic AI advice."]
          ].map(([n, title, body]) => (
            <div className="card p-6" key={n}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo text-white">{n}</div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] bg-ink p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold">Your inner life belongs to you.</h2>
          <p className="mt-4 max-w-3xl text-white/70">Private by default. Export anytime. Delete anytime. Your journal and life data should never become someone else’s training data.</p>
        </div>
      </section>
    </PageShell>
  );
}
