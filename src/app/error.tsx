"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Oops! Something went wrong
          </h1>
          <p className="mt-2 text-slate-600">
            We encountered an unexpected error. Don&apos;t worry, your data is safe.
          </p>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-left">
            <p className="text-sm font-semibold text-red-900">
              Error Details (Dev Only):
            </p>
            <p className="mt-1 text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            fullWidth
          >
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
