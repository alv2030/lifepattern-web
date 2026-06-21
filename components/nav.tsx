"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/check-in", label: "Check-In" },
  { href: "/reports/weekly", label: "Reports" },
  { href: "/history", label: "History" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">LifePattern</Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/") || (href === "/reports/weekly" && pathname.startsWith("/reports"));
            return (
              <Link
                key={href}
                href={href}
                className={active ? "font-semibold text-ink" : "text-muted transition hover:text-ink"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {authed ? (
            <>
              <Link
                href="/account"
                className={`text-sm transition hover:text-ink ${pathname === "/account" ? "font-semibold text-ink" : "text-muted"}`}
              >
                Account
              </Link>
              <button onClick={signOut} className="btn-secondary">Sign out</button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary">Start Free</Link>
          )}
        </div>
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
      {open && (
        <nav className="mt-4 flex flex-col gap-1 border-t border-black/5 pt-4 text-sm md:hidden">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/") || (href === "/reports/weekly" && pathname.startsWith("/reports"));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 ${active ? "bg-lavender font-semibold text-indigo" : "text-muted hover:bg-mist hover:text-ink"}`}
              >
                {label}
              </Link>
            );
          })}
          {authed ? (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 ${pathname === "/account" ? "bg-lavender font-semibold text-indigo" : "text-muted hover:bg-mist hover:text-ink"}`}
              >
                Account
              </Link>
              <button onClick={signOut} className="btn-secondary mt-3">Sign out</button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary mt-3 inline-flex" onClick={() => setOpen(false)}>Start Free</Link>
          )}
        </nav>
      )}
    </header>
  );
}
