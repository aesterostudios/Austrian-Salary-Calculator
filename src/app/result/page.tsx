"use client";

import Link from "next/link";
import { ArrowLeftIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { headerLinkClasses, headerPrimaryLinkClasses } from "@/components/header-link";
import { InfoTooltip } from "@/components/info-tooltip";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import {
  calculateNetSalary,
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
  socialInsurance: "#fecdd3",
  incomeTax: "#fda4af",
  netIncome: "#f43f5e",
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
    () => (payload ? calculateNetSalary(payload) : null),
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

  const handlePrint = () => {
    window.print();
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

  const summaryMetrics = [
    {
      label: result.summaryMetrics.netMonthlyAverage,
      value: formatCurrency(calculation.netMonthly, currencyLocale),
      accent: true,
      info: result.summaryMetrics.info.netMonthlyAverage,
      footnote: result.summaryMetrics.footnotes.netMonthlyAverage,
    },
    {
      label: result.summaryMetrics.netAnnualTotal,
      value: formatCurrency(calculation.netAnnual, currencyLocale),
      accent: true,
      info: result.summaryMetrics.info.netAnnualTotal,
      footnote: result.summaryMetrics.footnotes.netAnnualTotal,
    },
    {
      label: result.summaryMetrics.netMonthlyExcludingSpecial,
      value: formatCurrency(calculation.netRegularMonthly, currencyLocale),
      info: result.summaryMetrics.info.netMonthlyExcludingSpecial,
      footnote: result.summaryMetrics.footnotes.netMonthlyExcludingSpecial,
    },
    {
      label: result.summaryMetrics.netAnnualExcludingSpecial,
      value: formatCurrency(calculation.netRegularAnnual, currencyLocale),
      info: result.summaryMetrics.info.netAnnualExcludingSpecial,
      footnote: result.summaryMetrics.footnotes.netAnnualExcludingSpecial,
    },
  ];

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

  const specialSalaryMetrics = [
    {
      label: result.analysis.metrics.net13th,
      value: formatCurrency(calculation.netSpecial13th, currencyLocale),
    },
    {
      label: result.analysis.metrics.net14th,
      value: formatCurrency(calculation.netSpecial14th, currencyLocale),
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

  const breakdown = [
    {
      title: result.breakdownItems.socialInsurance.title,
      monthly: formatCurrency(calculation.socialInsuranceMonthly, currencyLocale),
      annual: formatCurrency(calculation.socialInsuranceAnnual, currencyLocale),
      description: result.breakdownItems.socialInsurance.description,
    },
    {
      title: result.breakdownItems.incomeTax.title,
      monthly: formatCurrency(calculation.incomeTaxMonthly, currencyLocale),
      annual: formatCurrency(calculation.incomeTaxAnnual, currencyLocale),
      description: result.breakdownItems.incomeTax.description,
    },
  ];

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

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-6 pb-16 pt-28 print:pt-0">
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
      <div className="absolute right-6 top-6 flex items-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full border-2 border-rose-500 bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 sm:px-4"
          aria-label={common.nav.calculator === "Calculator" ? "Print or save as PDF" : "Drucken oder als PDF speichern"}
        >
          <PrinterIcon className="h-4 w-4" />
          <span className="hidden sm:inline">
            {common.nav.calculator === "Calculator" ? "Print / PDF" : "Drucken / PDF"}
          </span>
        </button>
        <Link
          href="/"
          aria-label={common.nav.backToInput}
          className={`${headerPrimaryLinkClasses} gap-2 px-3 sm:px-4`}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{common.nav.backToInput}</span>
        </Link>
        <Link href="/faq" className={headerLinkClasses}>
          {common.nav.faq}
        </Link>
        <LanguageToggle />
      </div>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">
                {result.headerBadge}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-[3rem]">
                {result.headerTitle}
              </h1>
            </div>
          </div>

          <section className="grid gap-4">
            {["accent", "standard"].map((group) => {
              const filtered = summaryMetrics.filter((metric) =>
                group === "accent" ? metric.accent : !metric.accent,
              );

              if (filtered.length === 0) {
                return null;
              }

              return (
                <div key={group} className="grid gap-4 sm:grid-cols-2">
                  {filtered.map((metric) => (
                    <div
                      key={metric.label}
                      className={`group relative flex h-full flex-col overflow-visible rounded-[2rem] border border-rose-100/60 bg-white/95 p-[1px] shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl ${
                        metric.accent
                          ? "border-transparent bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/40"
                          : ""
                      }`}
                    >
                      <div
                        className={`relative flex flex-1 flex-col justify-between gap-4 overflow-visible rounded-[1.7rem] p-6 sm:p-7 ${
                          metric.accent
                            ? "bg-gradient-to-br from-rose-500 via-rose-500/95 to-rose-600 text-white"
                            : "bg-white/95 text-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className={`text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400 ${
                              metric.accent ? "text-white/70" : ""
                            }`}
                          >
                            {metric.label}
                          </p>
                          <InfoTooltip
                            content={metric.info}
                            accent={metric.accent}
                            label={metric.label}
                          />
                        </div>
                        <p
                          className={`font-semibold leading-tight tracking-tight text-balance ${
                            metric.accent
                              ? "text-[clamp(1.7rem,1.2rem+0.9vw,2.25rem)] text-white"
                              : "text-[clamp(1.55rem,1.1rem+0.8vw,2.05rem)] text-slate-900"
                          }`}
                        >
                          {metric.value}
                        </p>
                        {metric.footnote ? (
                          <p
                            className={`pt-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] ${
                              metric.accent ? "text-white/90" : "text-rose-500"
                            }`}
                          >
                            {metric.footnote}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>

          <section className="grid gap-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {result.specialPaymentsTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {specialSalaryMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-100/60 bg-white/95 p-[1px] shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex flex-1 flex-col justify-between gap-4 rounded-[1.7rem] bg-white/95 p-6 text-slate-700 sm:p-7">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400">
                      {metric.label}
                    </p>
                    <p className="text-[clamp(1.55rem,1.1rem+0.8vw,2.05rem)] font-semibold leading-tight tracking-tight text-slate-900">
                      {metric.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {result.breakdownTitle}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {breakdown.map((item) => (
                <div
                  key={item.title}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-rose-100/70 bg-white/85 p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold text-rose-600">{item.title}</p>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl font-semibold text-slate-900">
                    <span className="text-[clamp(1.6rem,1.9vw,2.1rem)] leading-tight tracking-tight">
                      {item.monthly}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      {common.currency.perMonth}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    <span className="font-semibold text-slate-600">{item.annual}</span> {common.currency.perYear}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500/80">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {result.analysis.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {analysisMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-100/60 bg-white/95 p-[1px] shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex flex-1 flex-col justify-between gap-4 rounded-[1.7rem] bg-white/95 p-6 text-slate-700 sm:p-7">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400">
                      {metric.label}
                    </p>
                    <p className="text-[clamp(1.55rem,1.1rem+0.8vw,2.05rem)] font-semibold leading-tight tracking-tight text-slate-900">
                      {metric.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6 rounded-[2rem] border border-rose-100/60 bg-white/95 p-6 shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7">
              <div className="flex flex-col gap-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400">
                  {result.analysis.chart.title}
                </p>
                <p className="text-sm text-slate-500">
                  {result.analysis.chart.description}
                </p>
              </div>
              {hasChartData ? (
                <div className="flex flex-col items-center gap-10">
                  <div className="relative h-80 w-80 sm:h-96 sm:w-96">
                    <svg viewBox="0 0 200 200" className="h-full w-full">
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
                                strokeWidth={isActive ? 4 : 0}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                className="cursor-pointer transition-[opacity,filter,transform] duration-300"
                                style={{
                                  opacity: isDimmed ? 0.35 : 1,
                                  filter: isActive
                                    ? `drop-shadow(0 10px 30px ${hexToRgba(singleDonutSegment.color, 0.35)})`
                                    : undefined,
                                  transform: isActive ? "scale(1.05)" : undefined,
                                  transformOrigin: `${donutCenter}px ${donutCenter}px`,
                                  transformBox: "fill-box",
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
                                stroke={isActive ? segment.color : "transparent"}
                                strokeWidth={isActive ? 4 : 0}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                className="cursor-pointer transition-[opacity,filter,transform] duration-300 focus:outline-none"
                                style={{
                                  opacity: isDimmed ? 0.35 : 1,
                                  filter: isActive
                                    ? `drop-shadow(0 10px 30px ${hexToRgba(segment.color, 0.35)})`
                                    : undefined,
                                  transform: isActive ? "scale(1.05)" : undefined,
                                  transformOrigin: `${donutCenter}px ${donutCenter}px`,
                                  transformBox: "fill-box",
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
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-rose-400">
                        {centerTitle}
                      </p>
                      <p className="text-xl font-semibold text-slate-900 sm:text-2xl">
                        {centerValue}
                      </p>
                      {centerPercent ? (
                        <p className="text-xs font-semibold text-rose-500">{centerPercent}</p>
                      ) : null}
                    </div>
                  </div>
                  <ul className="flex w-full flex-wrap gap-3 sm:flex-col">
                    {segmentsWithPercentages.map((segment) => {
                      const isInteractive = segment.value > 0 && hasChartData;
                      const isActive = activeSegment === segment.id;
                      const isDimmed = activeSegment !== null && !isActive;
                      const percentLabel = percentFormatter.format(segment.percentage / 100);

                      return (
                        <li
                          key={segment.id}
                          className="flex min-w-[min(100%,12rem)] flex-1 sm:min-w-0"
                        >
                          <button
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
                            className={`flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-rose-100/80 bg-rose-50/80 px-5 py-4 text-left shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 ${
                              !isInteractive
                                ? "cursor-default opacity-50"
                                : isActive
                                  ? "bg-white shadow-md ring-2 ring-rose-200/80"
                                  : "hover:-translate-y-0.5 hover:shadow-md"
                            } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                          >
                            <span className="flex w-full items-center justify-between gap-3">
                              <span className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-rose-500">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: segment.color }}
                                  aria-hidden
                                />
                                <span className="text-rose-600">{segment.label}</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-full bg-rose-500 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white">
                                {percentLabel}
                              </span>
                            </span>
                            <span className="text-base font-semibold text-slate-900">
                              {formatCurrency(segment.value, currencyLocale)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-rose-200/60 bg-white/70 p-6 text-sm font-medium text-slate-500">
                  {result.analysis.chart.emptyState}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/70 p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
              {result.noteSection.title}
            </h2>
            {result.noteSection.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-xs leading-relaxed text-rose-600">
                {paragraph}
              </p>
            ))}
          </section>
        </div>

        <aside className="flex flex-col gap-6 self-start rounded-[2rem] border border-rose-100/70 bg-white/95 p-8 shadow-lg">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose-500">
              {result.detailsTitle}
            </p>
            <div className="mt-4 space-y-6 text-sm text-slate-600">
              {contextSections.map((section, index) => (
                <div key={section.title ?? index} className="grid gap-3">
                  {section.title ? (
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-rose-500">
                      {section.title}
                    </p>
                  ) : null}
                  <ul className="grid gap-3">
                    {section.items.map((detail) => (
                      <li
                        key={`${section.title ?? "root"}-${detail.label}`}
                        className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm"
                      >
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-400">
                          {detail.label}
                        </span>
                        <span className="break-words text-base text-slate-700">{detail.value}</span>
                        {detail.note ? (
                          <span className="text-xs text-slate-500">{detail.note}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
