"use client";

import Link from "next/link";
import { ArrowLeftIcon, PrinterIcon, ChartPieIcon, ChartBarIcon, ChevronDownIcon, BanknotesIcon, DocumentTextIcon, LinkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { headerLinkClasses, headerPrimaryLinkClasses } from "@/components/header-link";
import { InfoTooltip } from "@/components/info-tooltip";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import {
  calculateNetSalary,
  calculateGrossFromNet,
  formatCurrency,
  type CalculatorInput,
} from "@/lib/calculator";

type AnalysisChartSegmentId = "socialInsurance" | "incomeTax" | "netIncome";

type AnalysisChartSegment = {
  id: AnalysisChartSegmentId;
  label: string;
  value: number;
  color: string;
};

const ANALYSIS_CHART_COLORS: Record<AnalysisChartSegmentId, string> = {
  netIncome: "#10b981",      // Emerald-500 - vibrant green for take-home
  socialInsurance: "#3b82f6", // Blue-500 - distinct blue
  incomeTax: "#f43f5e",       // Rose-500 - pink/red for tax
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number,
) {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSlice(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const endOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const startInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const endInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function hexToRgba(hex: string, alpha: number) {
  let normalized = hex.replace("#", "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (normalized.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parsePayload(value: string | null): CalculatorInput | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as CalculatorInput;
  } catch {
    try {
      return JSON.parse(value) as CalculatorInput;
    } catch {
      return null;
    }
  }
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payload = useMemo(
    () => parsePayload(searchParams.get("payload")),
    [searchParams],
  );

  useEffect(() => {
    if (!payload) {
      router.replace("/");
    }
  }, [payload, router]);

  const calculation = useMemo(
    () => {
      if (!payload) return null;

      // Use the appropriate calculator based on mode
      if (payload.calculationMode === 'net-to-gross') {
        return calculateGrossFromNet(payload);
      }

      return calculateNetSalary(payload);
    },
    [payload],
  );

  const { dictionary } = useLanguage();
  const { common, result } = dictionary;
  const currencyLocale = common.currency.locale;

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currencyLocale, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [currencyLocale],
  );

  const [activeSegment, setActiveSegment] = useState<AnalysisChartSegmentId | null>(null);
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [breakdownExpanded, setBreakdownExpanded] = useState(true);
  const [chartExpanded, setChartExpanded] = useState(true);
  const [inputsExpanded, setInputsExpanded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!payload || !calculation) {
    return null;
  }

  const grossLabel = result.labels.gross[payload.incomePeriod];
  const grossValue =
    payload.incomePeriod === "monthly"
      ? formatCurrency(calculation.grossMonthly, currencyLocale)
      : formatCurrency(calculation.grossAnnual, currencyLocale);

  const sanitizedChildrenUnder18 = Math.max(payload.childrenUnder18 ?? 0, 0);
  const sanitizedChildrenOver18 = Math.max(payload.childrenOver18 ?? 0, 0);
  const totalChildren = sanitizedChildrenUnder18 + sanitizedChildrenOver18;
  const sanitizedAllowance = Math.max(payload.allowance ?? 0, 0);
  const sanitizedTaxableBenefit = Math.max(
    payload.taxableBenefitsMonthly ?? 0,
    0,
  );
  const sanitizedCompanyCarValue = Math.max(
    payload.companyCarBenefitMonthly ?? 0,
    0,
  );
  const sanitizedCommuterAllowance = Math.max(
    payload.commuterAllowanceMonthly ?? 0,
    0,
  );
  const hasChildren = payload.hasChildren ?? totalChildren > 0;
  const familyBonusLabel =
    common.familyBonusOptions.find((option) => option.id === payload.familyBonus)
      ?.label ?? common.familyBonusOptions[0]?.label ?? "";
  const employmentTitle =
    common.employmentOptions.find((option) => option.id === payload.employmentType)
      ?.title ?? common.employmentOptions[0]?.title ?? "";

  const analysisMetrics = [
    {
      label: result.analysis.metrics.grossMonthly,
      value: formatCurrency(calculation.grossMonthly, currencyLocale),
    },
    {
      label: result.analysis.metrics.grossAnnual,
      value: formatCurrency(calculation.grossAnnual, currencyLocale),
    },
  ];

  const totalGrossAnnual = Math.max(calculation.grossAnnual, 0);
  const netAnnualPortion = Math.max(
    totalGrossAnnual - calculation.socialInsuranceAnnual - calculation.incomeTaxAnnual,
    0,
  );

  const analysisChartSegments: AnalysisChartSegment[] = [
    {
      id: "netIncome",
      label: result.analysis.chart.legend.netIncome,
      value: netAnnualPortion,
      color: ANALYSIS_CHART_COLORS.netIncome,
    },
    {
      id: "incomeTax",
      label: result.analysis.chart.legend.incomeTax,
      value: Math.max(calculation.incomeTaxAnnual, 0),
      color: ANALYSIS_CHART_COLORS.incomeTax,
    },
    {
      id: "socialInsurance",
      label: result.analysis.chart.legend.socialInsurance,
      value: Math.max(calculation.socialInsuranceAnnual, 0),
      color: ANALYSIS_CHART_COLORS.socialInsurance,
    },
  ];

  const chartSafeTotal = totalGrossAnnual > 0 ? totalGrossAnnual : 1;

  const segmentsWithPercentages = analysisChartSegments.map((segment) => {
    const safeValue = Math.max(segment.value, 0);
    const ratio = chartSafeTotal > 0 ? safeValue / chartSafeTotal : 0;

    return {
      ...segment,
      value: safeValue,
      percentage: Math.max(0, Math.min(ratio * 100, 100)),
      ratio,
    };
  });

  const positiveSegments = segmentsWithPercentages.filter((segment) => segment.value > 0);
  const hasChartData = totalGrossAnnual > 0 && positiveSegments.length > 0;

  const donutCenter = 100;
  const donutOuterRadius = 94;
  const donutInnerRadius = 56;

  let currentAngle = -Math.PI / 2;
  const donutArcSegments =
    positiveSegments.length > 1
      ? positiveSegments.map((segment) => {
          const angle = Math.max(segment.ratio, 0) * Math.PI * 2;
          const endAngle = currentAngle + angle;
          const path = describeDonutSlice(
            donutCenter,
            donutCenter,
            donutOuterRadius,
            donutInnerRadius,
            currentAngle,
            endAngle,
          );
          const mapped = { ...segment, path } as const;
          currentAngle = endAngle;
          return mapped;
        })
      : [];

  const singleDonutSegment = positiveSegments.length === 1 ? positiveSegments[0] : null;

  const activeSegmentData = activeSegment
    ? segmentsWithPercentages.find((segment) => segment.id === activeSegment) ?? null
    : null;

  const centerTitle = activeSegmentData
    ? activeSegmentData.label
    : result.analysis.chart.totalGross;
  const centerValue = activeSegmentData
    ? formatCurrency(activeSegmentData.value, currencyLocale)
    : formatCurrency(totalGrossAnnual, currencyLocale);
  const centerPercent = activeSegmentData
    ? percentFormatter.format(activeSegmentData.percentage / 100)
    : null;

  const contextSections: {
    title: string | null;
    items: { label: string; value: string; note?: string }[];
  }[] = [
    {
      title: null,
      items: [
        {
          label: result.labels.employmentType,
          value: employmentTitle,
        },
        {
          label: grossLabel,
          value: grossValue,
        },
      ],
    },
    {
      title: result.sectionTitles.family,
      items: [
        {
          label: result.labels.childrenUnder18,
          value: hasChildren ? String(sanitizedChildrenUnder18) : "0",
        },
        {
          label: result.labels.childrenOver18,
          value: hasChildren ? String(sanitizedChildrenOver18) : "0",
          note: result.labels.childrenOver18Note,
        },
        {
          label: result.labels.singleEarner,
          value: hasChildren && payload.isSingleEarner
            ? common.responses.yes
            : common.responses.no,
        },
        {
          label: result.labels.familyBonus,
          value: hasChildren ? familyBonusLabel : common.familyBonusOptions[0]?.label ?? "",
        },
      ],
    },
    {
      title: result.sectionTitles.benefits,
      items: [
        {
          label: result.labels.taxableBenefit,
          value: formatCurrency(sanitizedTaxableBenefit, currencyLocale),
        },
        {
          label: result.labels.companyCar,
          value: formatCurrency(sanitizedCompanyCarValue, currencyLocale),
        },
        {
          label: result.labels.allowance,
          value: formatCurrency(sanitizedAllowance, currencyLocale),
        },
      ],
    },
    {
      title: result.sectionTitles.commuter,
      items: [
        {
          label: result.labels.commuterAllowance,
          value: payload.receivesCommuterAllowance
            ? formatCurrency(sanitizedCommuterAllowance, currencyLocale)
            : formatCurrency(0, currencyLocale),
        },
      ],
    },
  ];

  // Determine the primary result to show prominently
  const isNetToGross = payload.calculationMode === 'net-to-gross';
  const primaryResultLabel = isNetToGross
    ? result.summaryMetrics.grossSalaryLabel
    : result.summaryMetrics.netMonthlyExcludingSpecial;
  const primaryResultValue = isNetToGross
    ? formatCurrency(calculation.grossMonthly, currencyLocale)
    : formatCurrency(calculation.netRegularMonthly, currencyLocale);
  const primaryResultAnnual = isNetToGross
    ? formatCurrency(calculation.grossAnnual, currencyLocale)
    : formatCurrency(calculation.netRegularAnnual, currencyLocale);
  const primaryResultNote = isNetToGross
    ? null
    : result.summaryMetrics.footnotes.netMonthlyExcludingSpecial;

  return (
    <main className="relative mx-auto min-h-screen w-full px-4 pb-20 pt-6 sm:px-6">
      {/* Print Header */}
      <header className="hidden print:flex print:mb-8 print:border-b-2 print:border-rose-500 print:pb-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-rose-600">Austrian Salary Calculator</h1>
            <p className="text-sm text-slate-600">{result.headerTitle}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>{new Date().toLocaleDateString(currencyLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </header>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-rose-100/50 bg-white/80 backdrop-blur-xl print:hidden sm:-mx-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className={`inline-flex items-center gap-2 ${headerPrimaryLinkClasses} text-sm`}>
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{common.nav.backToInput}</span>
              <span className="sm:hidden">{common.nav.calculator === "Calculator" ? "Back" : "Zurück"}</span>
            </Link>
            <Link href="/faq" className={`${headerLinkClasses} text-sm`}>
              {common.nav.faq}
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-rose-200 bg-white px-2.5 sm:px-3 py-2 text-sm font-semibold text-rose-600 shadow-sm transition-all cursor-pointer hover:border-rose-300 hover:bg-rose-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
              aria-label={linkCopied
                ? (common.nav.calculator === "Calculator" ? "Link copied!" : "Link kopiert!")
                : (common.nav.calculator === "Calculator" ? "Copy share link" : "Link kopieren")
              }
            >
              {linkCopied ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {linkCopied
                  ? (common.nav.calculator === "Calculator" ? "Copied!" : "Kopiert!")
                  : (common.nav.calculator === "Calculator" ? "Share" : "Teilen")
                }
              </span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-rose-200 bg-white px-2.5 sm:px-3 py-2 text-sm font-semibold text-rose-600 shadow-sm transition-all cursor-pointer hover:border-rose-300 hover:bg-rose-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
              aria-label={common.nav.calculator === "Calculator" ? "Print or save as PDF" : "Drucken oder als PDF speichern"}
              title={common.nav.calculator === "Calculator" ? "Print or save as PDF" : "Drucken oder als PDF speichern"}
            >
              <PrinterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {common.nav.calculator === "Calculator" ? "Print / PDF" : "Drucken / PDF"}
              </span>
            </button>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Hero Section - The Main Answer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
              {result.headerBadge}
            </span>
            {isNetToGross && (
              <>
                <span className="text-rose-300">•</span>
                <span className="text-xs font-semibold text-rose-700">
                  {common.nav.calculator === "Calculator" ? "Net → Gross" : "Netto → Brutto"}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {primaryResultLabel}
          </h1>
        </div>

        {/* Primary Result Card - The Big Answer */}
        <div className="overflow-hidden rounded-3xl border-2 border-rose-500 bg-gradient-to-br from-rose-500 via-rose-500/95 to-rose-600 shadow-2xl shadow-rose-500/30">
          <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
            {/* Monthly Amount */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-3">
                <p className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
                  {primaryResultValue}
                </p>
                <p className="text-base font-medium text-white/80 sm:text-lg">
                  {common.currency.perMonth}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-auto my-6 h-px w-24 bg-white/20"></div>

            {/* Annual Amount */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <p className="text-2xl font-bold text-white sm:text-3xl">
                  {primaryResultAnnual}
                </p>
                <p className="text-sm font-medium text-white/70">
                  {common.currency.perYear}
                </p>
              </div>
            </div>

            {/* Annotation */}
            {primaryResultNote && (
              <p className="mt-6 text-xs font-medium text-white/60 italic">
                {primaryResultNote}
              </p>
            )}
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Average Monthly Net Card */}
          <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
            <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                {result.summaryMetrics.netMonthlyAverage}
              </p>
              <InfoTooltip
                label={result.summaryMetrics.netMonthlyAverage}
                content={result.summaryMetrics.info.netMonthlyAverage}
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 break-all">
              {formatCurrency(calculation.netMonthly, currencyLocale)}
            </p>
            <p className="mt-2 text-xs text-slate-500 min-h-[2.5rem]">
              {result.summaryMetrics.footnotes.netMonthlyAverage}
            </p>
          </div>

          {/* Annual Total Card */}
          <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
            <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                {result.summaryMetrics.netAnnualTotal}
              </p>
              <InfoTooltip
                label={result.summaryMetrics.netAnnualTotal}
                content={result.summaryMetrics.info.netAnnualTotal}
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 break-all">
              {formatCurrency(calculation.netAnnual, currencyLocale)}
            </p>
            <p className="mt-2 text-xs text-slate-500 min-h-[2.5rem]">
              {result.summaryMetrics.footnotes.netAnnualTotal}
            </p>
          </div>

          {/* 13th Salary Card */}
          <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
            <div className="min-h-[2.5rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                {result.analysis.metrics.net13th}
              </p>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 break-all">
              {formatCurrency(calculation.netSpecial13th, currencyLocale)}
            </p>
            <p className="mt-2 text-xs text-slate-500 min-h-[2.5rem]">
              {common.nav.calculator === "Calculator" ? "Special payment" : "Sonderzahlung"}
            </p>
          </div>

          {/* 14th Salary Card */}
          <div className="group relative rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg transition-all hover:border-rose-300 hover:shadow-xl">
            <div className="min-h-[2.5rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                {result.analysis.metrics.net14th}
              </p>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 break-all">
              {formatCurrency(calculation.netSpecial14th, currencyLocale)}
            </p>
            <p className="mt-2 text-xs text-slate-500 min-h-[2.5rem]">
              {common.nav.calculator === "Calculator" ? "Special payment" : "Sonderzahlung"}
            </p>
          </div>
        </div>

        {/* Collapsible Section: Detailed Breakdown */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => setBreakdownExpanded(!breakdownExpanded)}
            aria-expanded={breakdownExpanded}
            aria-controls="breakdown-section-content"
            className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
          >
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <BanknotesIcon className="h-5 w-5 text-rose-500" />
                {common.nav.calculator === "Calculator" ? "Detailed Breakdown" : "Detaillierte Aufschlüsselung"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {common.nav.calculator === "Calculator" ? "Taxes, deductions, and payments" : "Steuern, Abzüge und Zahlungen"}
              </p>
            </div>
            <div className={`transform transition-transform duration-200 ${breakdownExpanded ? 'rotate-180' : ''}`}>
              <ChevronDownIcon className="h-5 w-5 text-rose-500" />
            </div>
          </button>
          {breakdownExpanded && (
            <div id="breakdown-section-content" className="space-y-6 px-6 py-6 sm:px-8">
              {/* Payment Comparison Table */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-1 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {common.nav.calculator === "Calculator" ? "Payment Type" : "Zahlungsart"}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {common.nav.calculator === "Calculator" ? "Regular" : "Regulär"}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {common.nav.calculator === "Calculator" ? "13th Salary" : "13. Gehalt"}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {common.nav.calculator === "Calculator" ? "14th Salary" : "14. Gehalt"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {common.nav.calculator === "Calculator" ? "Gross" : "Brutto"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(calculation.grossMonthly, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(calculation.grossMonthly, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(calculation.grossMonthly, currencyLocale)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {common.nav.calculator === "Calculator" ? "Social Insurance" : "Sozialversicherung"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-blue-700">
                        -{formatCurrency(calculation.socialInsuranceMonthly, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-blue-700 bg-blue-100/50">
                        -{formatCurrency(calculation.socialInsuranceSpecial, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-blue-700 bg-blue-100/50">
                        -{formatCurrency(calculation.socialInsuranceSpecial, currencyLocale)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-rose-50/30">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {common.nav.calculator === "Calculator" ? "Income Tax" : "Lohnsteuer"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-rose-700">
                        -{formatCurrency(calculation.incomeTaxMonthly, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-rose-700 bg-rose-100/40">
                        -{formatCurrency(calculation.incomeTaxSpecial13th, currencyLocale)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-rose-700 bg-rose-100/70">
                        -{formatCurrency(calculation.incomeTaxSpecial14th, currencyLocale)}
                      </td>
                    </tr>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 font-semibold">
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {common.nav.calculator === "Calculator" ? "= Net" : "= Netto"}
                      </td>
                      <td className="px-4 py-4 text-right text-lg font-bold text-slate-900">
                        {formatCurrency(calculation.netRegularMonthly, currencyLocale)}
                      </td>
                      <td className="px-4 py-4 text-right text-lg font-bold text-slate-900">
                        {formatCurrency(calculation.netSpecial13th, currencyLocale)}
                      </td>
                      <td className="px-4 py-4 text-right text-lg font-bold text-slate-900">
                        {formatCurrency(calculation.netSpecial14th, currencyLocale)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Why 13th and 14th are Different */}
              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 mb-3">
                  {common.nav.calculator === "Calculator" ? "💡 Why 13th ≠ 14th salary?" : "💡 Warum 13. ≠ 14. Gehalt?"}
                </p>
                <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 flex-shrink-0">1</span>
                    <p>
                      <span className="font-semibold text-blue-900">{common.nav.calculator === "Calculator" ? "Social insurance:" : "Sozialversicherung:"}</span>
                      {" "}
                      {common.nav.calculator === "Calculator"
                        ? `Special payments have a lower rate (${payload.employmentType === "employee" ? "17.07%" : payload.employmentType === "apprentice" ? "14.45%" : "5.10%"} vs ${payload.employmentType === "employee" ? "18.07%" : payload.employmentType === "apprentice" ? "15.50%" : "5.10%"}) for regular payments, so both the 13th and 14th salary have the same deduction.`
                        : `Sonderzahlungen haben einen niedrigeren Satz (${payload.employmentType === "employee" ? "17,07%" : payload.employmentType === "apprentice" ? "14,45%" : "5,10%"} vs ${payload.employmentType === "employee" ? "18,07%" : payload.employmentType === "apprentice" ? "15,50%" : "5,10%"}) für reguläre Zahlungen, daher haben das 13. und 14. Gehalt denselben Abzug.`}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 flex-shrink-0">2</span>
                    <p>
                      <span className="font-semibold text-rose-900">{common.nav.calculator === "Calculator" ? "Income tax:" : "Lohnsteuer:"}</span>
                      {" "}
                      {common.nav.calculator === "Calculator"
                        ? "Progressive tax brackets with annual caps are applied sequentially. The 13th payment uses lower tax brackets first (6% after €620 tax-free), leaving higher brackets for the 14th payment."
                        : "Progressive Steuerstufen mit Jahresobergrenzen werden nacheinander angewendet. Die 13. Zahlung nutzt zuerst niedrigere Steuerstufen (6% nach €620 steuerfrei), wodurch höhere Stufen für die 14. Zahlung übrig bleiben."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Section: Visual Analysis & Chart */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => setChartExpanded(!chartExpanded)}
            aria-expanded={chartExpanded}
            aria-controls="chart-section-content"
            className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
          >
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ChartPieIcon className="h-5 w-5 text-rose-500" />
                {common.nav.calculator === "Calculator" ? "Visual Analysis" : "Visuelle Analyse"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {common.nav.calculator === "Calculator" ? "Charts and detailed analysis" : "Diagramme und detaillierte Analyse"}
              </p>
            </div>
            <div className={`transform transition-transform duration-200 ${chartExpanded ? 'rotate-180' : ''}`}>
              <ChevronDownIcon className="h-5 w-5 text-rose-500" />
            </div>
          </button>
            {chartExpanded && (
              <div id="chart-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                {/* Analysis Metrics */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {analysisMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border-2 border-rose-100 bg-white p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-2xl font-bold text-slate-900">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-6 rounded-[2rem] border border-rose-100/60 bg-white/95 p-6 shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400">
                        {result.analysis.chart.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {result.analysis.chart.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur">
                      <button
                        type="button"
                        onClick={() => setChartType('donut')}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 ${
                          chartType === 'donut'
                            ? 'bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]'
                            : 'text-rose-600/80 hover:text-rose-700'
                        }`}
                        aria-pressed={chartType === 'donut'}
                      >
                        <ChartPieIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">{common.nav.calculator === "Calculator" ? "Donut" : "Donut"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartType('bar')}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 ${
                          chartType === 'bar'
                            ? 'bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]'
                            : 'text-rose-600/80 hover:text-rose-700'
                        }`}
                        aria-pressed={chartType === 'bar'}
                      >
                        <ChartBarIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">{common.nav.calculator === "Calculator" ? "Bars" : "Balken"}</span>
                      </button>
                    </div>
                  </div>

                  {hasChartData ? (
                    <div className="flex flex-col gap-8">
                      {chartType === 'donut' ? (
                        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
                          <div className="relative w-full max-w-[min(100%,20rem)] sm:max-w-sm">
                            <svg
                              viewBox="0 0 200 200"
                              className="h-auto w-full"
                              style={{ aspectRatio: '1 / 1' }}
                              role="img"
                              aria-label={`${result.analysis.chart.title}: ${centerTitle} - ${centerValue}`}
                            >
                              <circle
                                cx={donutCenter}
                                cy={donutCenter}
                                r={donutOuterRadius}
                                fill="#ffe4e6"
                                className="opacity-80"
                              />
                              {singleDonutSegment ? (
                                (() => {
                                  const isActive = activeSegment === singleDonutSegment.id;
                                  const isDimmed =
                                    activeSegment !== null && activeSegment !== singleDonutSegment.id;
                                  const segmentPercentLabel = percentFormatter.format(
                                    singleDonutSegment.percentage / 100,
                                  );

                                  return (
                                    <>
                                      <circle
                                        cx={donutCenter}
                                        cy={donutCenter}
                                        r={donutOuterRadius}
                                        fill={singleDonutSegment.color}
                                        stroke={isActive ? singleDonutSegment.color : "transparent"}
                                        strokeWidth={isActive ? 6 : 0}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        className="cursor-pointer transition-all duration-200"
                                        style={{
                                          opacity: isDimmed ? 0.4 : isActive ? 1 : 0.95,
                                          filter: isActive
                                            ? `drop-shadow(0 6px 20px ${hexToRgba(singleDonutSegment.color, 0.4)}) brightness(1.1)`
                                            : undefined,
                                        }}
                                        tabIndex={0}
                                        aria-label={`${singleDonutSegment.label}: ${formatCurrency(
                                          singleDonutSegment.value,
                                          currencyLocale,
                                        )} (${segmentPercentLabel})`}
                                        onMouseEnter={() => setActiveSegment(singleDonutSegment.id)}
                                        onFocus={() => setActiveSegment(singleDonutSegment.id)}
                                        onMouseLeave={() => setActiveSegment(null)}
                                        onBlur={() => setActiveSegment(null)}
                                        onKeyDown={(event) => {
                                          if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            setActiveSegment(singleDonutSegment.id);
                                          }
                                        }}
                                      />
                                      <circle
                                        cx={donutCenter}
                                        cy={donutCenter}
                                        r={donutInnerRadius}
                                        fill="white"
                                      />
                                    </>
                                  );
                                })()
                              ) : (
                                <>
                                  {donutArcSegments.map((segment) => {
                                    const isActive = activeSegment === segment.id;
                                    const isDimmed =
                                      activeSegment !== null && activeSegment !== segment.id;
                                    const isInteractive = segment.value > 0;
                                    const segmentPercentLabel = percentFormatter.format(
                                      segment.percentage / 100,
                                    );

                                    return (
                                      <path
                                        key={segment.id}
                                        d={segment.path}
                                        fill={segment.color}
                                        stroke={isActive ? "#ffffff" : "transparent"}
                                        strokeWidth={isActive ? 3 : 0}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        className="cursor-pointer transition-all duration-200 focus:outline-none"
                                        style={{
                                          opacity: isDimmed ? 0.4 : isActive ? 1 : 0.95,
                                          filter: isActive
                                            ? `drop-shadow(0 6px 20px ${hexToRgba(segment.color, 0.4)}) brightness(1.1)`
                                            : undefined,
                                        }}
                                        tabIndex={isInteractive ? 0 : -1}
                                        aria-label={`${segment.label}: ${formatCurrency(
                                          segment.value,
                                          currencyLocale,
                                        )} (${segmentPercentLabel})`}
                                        onMouseEnter={() => setActiveSegment(segment.id)}
                                        onFocus={() => setActiveSegment(segment.id)}
                                        onMouseLeave={() => setActiveSegment(null)}
                                        onBlur={() => setActiveSegment(null)}
                                        onKeyDown={(event) => {
                                          if ((event.key === "Enter" || event.key === " ") && isInteractive) {
                                            event.preventDefault();
                                            setActiveSegment(segment.id);
                                          }
                                        }}
                                      />
                                    );
                                  })}
                                  <circle
                                    cx={donutCenter}
                                    cy={donutCenter}
                                    r={donutInnerRadius}
                                    fill="white"
                                  />
                                </>
                              )}
                            </svg>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
                              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.32em] text-rose-400 sm:text-[0.6rem]">
                                {centerTitle}
                              </p>
                              <p className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                                {centerValue}
                              </p>
                              {centerPercent ? (
                                <p className="text-sm font-semibold text-rose-500 sm:text-base">{centerPercent}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex w-full flex-col gap-3 lg:max-w-xs">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                              {common.nav.calculator === "Calculator" ? "Breakdown" : "Aufschlüsselung"}
                            </p>
                            {segmentsWithPercentages.map((segment) => {
                              const isInteractive = segment.value > 0 && hasChartData;
                              const isActive = activeSegment === segment.id;
                              const isDimmed = activeSegment !== null && !isActive;
                              const percentLabel = percentFormatter.format(segment.percentage / 100);

                              return (
                                <button
                                  key={segment.id}
                                  type="button"
                                  disabled={!isInteractive}
                                  onMouseEnter={
                                    isInteractive ? () => setActiveSegment(segment.id) : undefined
                                  }
                                  onFocus={
                                    isInteractive ? () => setActiveSegment(segment.id) : undefined
                                  }
                                  onMouseLeave={
                                    isInteractive ? () => setActiveSegment(null) : undefined
                                  }
                                  onBlur={
                                    isInteractive ? () => setActiveSegment(null) : undefined
                                  }
                                  className={`flex w-full flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 ${
                                    !isInteractive
                                      ? "cursor-default border-rose-100/50 bg-rose-50/30 opacity-50"
                                      : isActive
                                        ? "border-rose-400 bg-rose-50/90 shadow-lg"
                                        : "border-rose-100 bg-white hover:border-rose-300 hover:shadow-md"
                                  } ${isDimmed ? "opacity-50" : "opacity-100"}`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-3 w-3 rounded-full ring-2 ring-white"
                                        style={{ backgroundColor: segment.color }}
                                        aria-hidden
                                      />
                                      <span className="text-sm font-semibold text-slate-800">
                                        {segment.label}
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                      {percentLabel}
                                    </span>
                                  </div>
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-lg font-bold text-rose-600">
                                      {formatCurrency(segment.value, currencyLocale)}
                                    </span>
                                    <span className="text-xs text-slate-500">{common.currency.perYear}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-4">
                            {segmentsWithPercentages.map((segment) => {
                              const isInteractive = segment.value > 0 && hasChartData;
                              const isActive = activeSegment === segment.id;
                              const isDimmed = activeSegment !== null && !isActive;
                              const percentLabel = percentFormatter.format(segment.percentage / 100);
                              const widthPercent = segment.percentage;

                              return (
                                <button
                                  key={segment.id}
                                  type="button"
                                  disabled={!isInteractive}
                                  onMouseEnter={
                                    isInteractive ? () => setActiveSegment(segment.id) : undefined
                                  }
                                  onFocus={
                                    isInteractive ? () => setActiveSegment(segment.id) : undefined
                                  }
                                  onMouseLeave={
                                    isInteractive ? () => setActiveSegment(null) : undefined
                                  }
                                  onBlur={
                                    isInteractive ? () => setActiveSegment(null) : undefined
                                  }
                                  className={`group flex w-full flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 ${
                                    !isInteractive
                                      ? "cursor-default border-rose-100/50 bg-rose-50/30 opacity-50"
                                      : isActive
                                        ? "border-rose-400 bg-rose-50/90 shadow-xl"
                                        : "border-rose-100 bg-white hover:border-rose-300 hover:shadow-lg"
                                  } ${isDimmed ? "opacity-50" : "opacity-100"}`}
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="h-3 w-3 rounded-full ring-2 ring-white shadow-sm"
                                        style={{ backgroundColor: segment.color }}
                                        aria-hidden
                                      />
                                      <span className="text-sm font-semibold text-slate-800">
                                        {segment.label}
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                      {percentLabel}
                                    </span>
                                  </div>
                                  <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-100">
                                    <div
                                      className="absolute inset-y-0 left-0 flex items-center rounded-lg px-4 transition-all duration-500 ease-out"
                                      style={{
                                        width: `${widthPercent}%`,
                                        backgroundColor: segment.color,
                                        minWidth: widthPercent > 5 ? '80px' : '0px'
                                      }}
                                    >
                                      {widthPercent > 15 && (
                                        <span className="whitespace-nowrap text-sm font-bold text-white drop-shadow-sm">
                                          {formatCurrency(segment.value, currencyLocale)}
                                        </span>
                                      )}
                                    </div>
                                    {widthPercent <= 15 && segment.value > 0 && (
                                      <div className="absolute inset-y-0 right-4 flex items-center">
                                        <span className="whitespace-nowrap text-sm font-bold text-slate-700">
                                          {formatCurrency(segment.value, currencyLocale)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-600">
                                {common.nav.calculator === "Calculator" ? "Total Gross Annual" : "Brutto Gesamt (Jahr)"}
                              </span>
                              <span className="font-bold text-rose-600">
                                {formatCurrency(totalGrossAnnual, currencyLocale)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-rose-200/60 bg-white/70 p-6 text-sm font-medium text-slate-500">
                      {result.analysis.chart.emptyState}
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Collapsible Section: Your Inputs */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => setInputsExpanded(!inputsExpanded)}
            aria-expanded={inputsExpanded}
            aria-controls="inputs-section-content"
            className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
          >
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <DocumentTextIcon className="h-5 w-5 text-rose-500" />
                {common.nav.calculator === "Calculator" ? "Your Inputs" : "Deine Eingaben"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {common.nav.calculator === "Calculator" ? "Input summary" : "Zusammenfassung deiner Eingaben"}
              </p>
            </div>
            <div className={`transform transition-transform duration-200 ${inputsExpanded ? 'rotate-180' : ''}`}>
              <ChevronDownIcon className="h-5 w-5 text-rose-500" />
            </div>
          </button>
          {inputsExpanded && (
            <div id="inputs-section-content" className="space-y-6 px-6 py-6 sm:px-8">
              {contextSections.map((section, sectionIndex) => (
                <div key={section.title ?? sectionIndex} className="space-y-3">
                  {section.title ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
                      {section.title}
                    </p>
                  ) : null}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.items.map((detail) => (
                      <div
                        key={`${section.title ?? "root"}-${detail.label}`}
                        className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm"
                      >
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-400">
                          {detail.label}
                        </span>
                        <span className="break-words text-base font-semibold text-slate-700">{detail.value}</span>
                        {detail.note ? (
                          <span className="text-xs text-slate-500">{detail.note}</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes on the Results */}
        <div className="rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-600">
            {result.noteSection.title}
          </p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {result.noteSection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
