"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { headerLinkClasses, headerPrimaryLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import {
  calculateNetSalary,
  formatCurrency,
  type CalculatorInput,
} from "@/lib/calculator";

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
      label: result.summaryMetrics.netMonthly,
      value: formatCurrency(calculation.netMonthly, currencyLocale),
      accent: true,
      footnote: result.summaryMetrics.footnote,
    },
    {
      label: result.summaryMetrics.netAnnual,
      value: formatCurrency(calculation.netAnnual, currencyLocale),
      accent: true,
      footnote: result.summaryMetrics.footnote,
    },
    {
      label: result.summaryMetrics.grossMonthly,
      value: formatCurrency(calculation.grossMonthly, currencyLocale),
    },
    {
      label: result.summaryMetrics.grossAnnual,
      value: formatCurrency(calculation.grossAnnual, currencyLocale),
    },
  ];

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
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-6 pb-16 pt-28">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link href="/" className={headerPrimaryLinkClasses}>
          {common.nav.backToInput}
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
            {["accent", "standard"].map((group) => (
              <div key={group} className="grid gap-4 sm:grid-cols-2">
                {summaryMetrics
                  .filter((metric) => (group === "accent" ? metric.accent : !metric.accent))
                  .map((metric) => (
                    <div
                      key={metric.label}
                      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-100/60 bg-white/95 p-[1px] shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl ${
                        metric.accent
                          ? "border-transparent bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/40"
                          : ""
                      }`}
                    >
                      <div
                        className={`relative flex flex-1 flex-col justify-between gap-4 rounded-[1.7rem] p-6 sm:p-7 ${
                          metric.accent
                            ? "bg-gradient-to-br from-rose-500 via-rose-500/95 to-rose-600 text-white"
                            : "bg-white/95 text-slate-700"
                        }`}
                      >
                        <p
                          className={`text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-rose-400 ${
                            metric.accent ? "text-white/70" : ""
                          }`}
                        >
                          {metric.label}
                        </p>
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
                            className={`text-[0.7rem] font-medium tracking-wide ${
                              metric.accent ? "text-white/75" : "text-rose-500"
                            }`}
                          >
                            {metric.footnote}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
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
