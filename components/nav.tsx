import Link from "next/link";

export function Nav() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-xl font-bold tracking-tight">LifePattern</Link>
      <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/check-in">Check-In</Link>
        <Link href="/reports/weekly">Reports</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
      <Link href="/onboarding" className="btn-primary">Start Free</Link>
    </header>
  );
}
