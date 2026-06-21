"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
      <p className="max-w-sm text-muted">
        An unexpected error occurred. Try refreshing the page or return to the dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
        <Link href="/dashboard" className="btn-secondary">
          Go to dashboard
        </Link>
      </div>
      {error.digest && (
        <p className="text-xs text-muted">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
