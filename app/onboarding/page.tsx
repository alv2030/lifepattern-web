import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function Onboarding() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Set up your clarity baseline</h1>
        <p className="mt-4 text-lg text-muted">This keeps the first version simple. A real app would save these to Supabase.</p>
        <div className="mt-8 grid gap-6">
          <div className="card p-6"><h2 className="text-xl font-semibold">Why are you here?</h2><div className="mt-4 flex flex-wrap gap-3">{["Understand stress","Improve energy","Avoid burnout","Understand myself","Improve happiness"].map(x=><span className="pill" key={x}>{x}</span>)}</div></div>
          <div className="card p-6"><h2 className="text-xl font-semibold">What kind of work do you do?</h2><div className="mt-4 flex flex-wrap gap-3">{["Engineer","Founder","Manager","Consultant","Healthcare","Other"].map(x=><span className="pill" key={x}>{x}</span>)}</div></div>
          <div className="card p-6"><h2 className="text-xl font-semibold">Privacy promise</h2><p className="mt-3 text-muted">Your data is private by default, exportable, and deletable. AI is used only to explain evidence-backed insights.</p></div>
        </div>
        <Link href="/check-in" className="btn-primary mt-8 inline-flex">Continue to first check-in</Link>
      </section>
    </PageShell>
  );
}
