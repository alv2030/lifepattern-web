"use client";

import Link from "next/link";
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
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
          <p className="max-w-sm text-gray-500">
            An unexpected error occurred. Try refreshing the page or return to the dashboard.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold"
            >
              Go to dashboard
            </Link>
          </div>
          {error.digest && (
            <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
