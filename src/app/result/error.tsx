"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ResultError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Result page error:", error);
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
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Calculation Error
          </h1>
          <p className="mt-2 text-slate-600">
            We couldn't process your salary calculation. This might be due to invalid input data.
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
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20"
          >
            Start New Calculation
          </Link>
          <button
            onClick={reset}
            className="rounded-2xl border-2 border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-600 shadow-lg transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}
