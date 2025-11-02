"use client";

import { InfoTooltip } from "@/components/info-tooltip";
import type { CalculationResult } from "@/lib/calculator";

interface ResultSummaryCardsProps {
  calculation: CalculationResult;
  currencyLocale: string;
  formatCurrency: (value: number, locale: string) => string;
  dictionary: {
    summaryMetrics: {
      netMonthlyAverage: string;
      netAnnualTotal: string;
      info: {
        netMonthlyAverage: string;
        netAnnualTotal: string;
      };
      footnotes: {
        netMonthlyAverage: string;
        netAnnualTotal: string;
      };
    };
    analysis: {
      metrics: {
        net13th: string;
        net14th: string;
      };
    };
    nav: {
      calculator: string;
    };
  };
}

export function ResultSummaryCards({
  calculation,
  currencyLocale,
  formatCurrency,
  dictionary,
}: ResultSummaryCardsProps) {
  const { summaryMetrics, analysis, nav } = dictionary;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Average Monthly Net Card */}
      <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            {summaryMetrics.netMonthlyAverage}
          </p>
          <InfoTooltip
            label={summaryMetrics.netMonthlyAverage}
            content={summaryMetrics.info.netMonthlyAverage}
          />
        </div>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {formatCurrency(calculation.netMonthly, currencyLocale)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {summaryMetrics.footnotes.netMonthlyAverage}
        </p>
      </div>

      {/* Annual Total Card */}
      <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            {summaryMetrics.netAnnualTotal}
          </p>
          <InfoTooltip
            label={summaryMetrics.netAnnualTotal}
            content={summaryMetrics.info.netAnnualTotal}
          />
        </div>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {formatCurrency(calculation.netAnnual, currencyLocale)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {summaryMetrics.footnotes.netAnnualTotal}
        </p>
      </div>

      {/* 13th Salary Card */}
      <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {analysis.metrics.net13th}
        </p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {formatCurrency(calculation.netSpecial13th, currencyLocale)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {nav.calculator === "Calculator" ? "Special payment" : "Sonderzahlung"}
        </p>
      </div>

      {/* 14th Salary Card */}
      <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {analysis.metrics.net14th}
        </p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {formatCurrency(calculation.netSpecial14th, currencyLocale)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {nav.calculator === "Calculator" ? "Special payment" : "Sonderzahlung"}
        </p>
      </div>
    </div>
  );
}
