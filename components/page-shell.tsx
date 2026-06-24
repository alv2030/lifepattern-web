import Link from "next/link";
import { Nav } from "./nav";

interface PageShellProps {
  children: React.ReactNode;
  bg?: string;
}

export function PageShell({ children, bg }: PageShellProps) {
  if (!bg) {
    return (
      <>
        <Nav />
        <main>{children}</main>
        <footer className="mt-16 border-t border-black/5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-muted">
            <span>© 2026 LifePattern</span>
            <Link href="/privacy" className="transition hover:text-ink">Privacy</Link>
          </div>
        </footer>
      </>
    );
  }

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Warm parchment overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(251, 244, 239, 0.30)" }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t" style={{ borderColor: "rgba(232,221,210,0.5)" }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm" style={{ color: "#6F675F" }}>
            <span>© 2026 LifePattern</span>
            <Link href="/privacy" className="transition hover:text-warm-ink" style={{ color: "#6F675F" }}>Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
