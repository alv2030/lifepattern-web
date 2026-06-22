"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Discoveries",  href: "#discoveries"  },
  { label: "Garden",       href: "#garden"        },
  { label: "Pricing",      href: "#pricing"       },
  { label: "About",        href: "#about"         },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

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
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(251,244,239,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderColor: "#E8DDD2",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-warm-ink"
        >
          LifePattern
        </Link>

        {/* Centre links — desktop */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-warm-muted transition-colors duration-150 hover:text-warm-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions — desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-warm-muted transition-colors hover:text-warm-ink"
              >
                Dashboard
              </Link>
              <button onClick={signOut} className="lp-btn-secondary text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-warm-muted transition-colors hover:text-warm-ink"
              >
                Log in
              </Link>
              <Link href="/auth" className="lp-btn-primary">
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 transition-all duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            style={{ background: "#1E1B18" }}
          />
          <span
            className={`block h-px w-6 transition-all duration-200 ${open ? "opacity-0" : ""}`}
            style={{ background: "#1E1B18" }}
          />
          <span
            className={`block h-px w-6 transition-all duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            style={{ background: "#1E1B18" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="flex flex-col gap-1 border-t px-6 pb-5 pt-4 text-sm md:hidden"
          style={{ borderColor: "#E8DDD2" }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-warm-muted transition-colors hover:bg-parchment hover:text-warm-ink"
            >
              {label}
            </Link>
          ))}

          <div className="mt-3 flex flex-col gap-2 border-t pt-4" style={{ borderColor: "#E8DDD2" }}>
            {authed ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-warm-muted transition-colors hover:bg-parchment hover:text-warm-ink"
                >
                  Dashboard
                </Link>
                <button onClick={signOut} className="lp-btn-secondary">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-warm-muted transition-colors hover:bg-parchment hover:text-warm-ink"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="lp-btn-primary text-center"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
