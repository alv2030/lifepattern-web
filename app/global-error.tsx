"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1.5rem", padding: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#6D7280", maxWidth: "24rem", margin: 0 }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{ background: "#332E7E", color: "#fff", border: "none", borderRadius: "9999px", padding: "0.75rem 1.5rem", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
