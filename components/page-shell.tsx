import Link from "next/link";
import { Nav } from "./nav";

export function PageShell({ children }: { children: React.ReactNode }) {
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
