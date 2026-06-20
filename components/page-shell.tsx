import { Nav } from "./nav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}
