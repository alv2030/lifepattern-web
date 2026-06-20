"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/check-in", label: "Check-In" },
  { href: "/reports/weekly", label: "Reports" },
  { href: "/privacy", label: "Privacy" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">LifePattern</Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {LINKS.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/onboarding" className="btn-primary hidden md:inline-flex">Start Free</Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="mt-4 flex flex-col gap-4 border-t border-black/5 pt-4 text-sm md:hidden">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href="/onboarding" className="btn-primary mt-2 inline-flex" onClick={() => setOpen(false)}>Start Free</Link>
        </nav>
      )}
    </header>
  );
}
