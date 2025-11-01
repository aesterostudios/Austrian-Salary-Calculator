"use client";

import Link from "next/link";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { headerLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import {
  BuildingOffice2Icon,
  AcademicCapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type {
  CalculatorInput,
  EmploymentType,
  FamilyBonusOption,
  IncomePeriod,
} from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";

type EmploymentOption = {
  id: EmploymentType;
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const employmentIcons: Record<EmploymentType, ComponentType<SVGProps<SVGSVGElement>>> = {
  employee: BuildingOffice2Icon,
  apprentice: AcademicCapIcon,
  pensioner: UserIcon,
};

const FORM_STATE_STORAGE_KEY = "salary-calculator:form-state";

type StoredFormState = {
  employmentType: EmploymentType;
  incomePeriod: IncomePeriod;
  income: string;
  hasChildren: boolean;
  childrenUnder18: string;
  childrenOver18: string;
  isSingleEarner: boolean;
  familyBonus: FamilyBonusOption;
  usesTaxableBenefits: boolean;
  taxableBenefit: string;
  companyCarValue: string;
  allowance: string;
  receivesCommuterAllowance: boolean;
  commuterAllowanceValue: string;
};

export default function Home() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const { common, home } = dictionary;
  const currencyLocale = common.currency.locale;

  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    "employee",
  );
  const [incomePeriod, setIncomePeriod] = useState<IncomePeriod>("monthly");
  const [income, setIncome] = useState<string>("3000");
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [childrenUnder18, setChildrenUnder18] = useState<string>("0");
  const [childrenOver18, setChildrenOver18] = useState<string>("0");
  const [isSingleEarner, setIsSingleEarner] = useState<boolean>(false);
  const [familyBonus, setFamilyBonus] = useState<FamilyBonusOption>("none");
  const [usesTaxableBenefits, setUsesTaxableBenefits] =
    useState<boolean>(false);
  const [taxableBenefit, setTaxableBenefit] = useState<string>("0");
  const [companyCarValue, setCompanyCarValue] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [receivesCommuterAllowance, setReceivesCommuterAllowance] =
    useState<boolean>(false);
  const [commuterAllowanceValue, setCommuterAllowanceValue] =
    useState<string>("0");
  const [isRestoredFromStorage, setIsRestoredFromStorage] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.sessionStorage.getItem(FORM_STATE_STORAGE_KEY);
    if (!stored) {
      setIsRestoredFromStorage(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<StoredFormState>;

      if (parsed.employmentType) {
        setEmploymentType(parsed.employmentType);
      }
      if (parsed.incomePeriod) {
        setIncomePeriod(parsed.incomePeriod);
      }
      if (parsed.income) {
        setIncome(parsed.income);
      }
      if (typeof parsed.hasChildren === "boolean") {
        setHasChildren(parsed.hasChildren);
      }
      if (typeof parsed.childrenUnder18 === "string") {
        setChildrenUnder18(parsed.childrenUnder18);
      }
      if (typeof parsed.childrenOver18 === "string") {
        setChildrenOver18(parsed.childrenOver18);
      }
      if (typeof parsed.isSingleEarner === "boolean") {
        setIsSingleEarner(parsed.isSingleEarner);
      }
      if (parsed.familyBonus) {
        setFamilyBonus(parsed.familyBonus);
      }
      if (typeof parsed.usesTaxableBenefits === "boolean") {
        setUsesTaxableBenefits(parsed.usesTaxableBenefits);
      }
      if (typeof parsed.taxableBenefit === "string") {
        setTaxableBenefit(parsed.taxableBenefit);
      }
      if (typeof parsed.companyCarValue === "string") {
        setCompanyCarValue(parsed.companyCarValue);
      }
      if (typeof parsed.allowance === "string") {
        setAllowance(parsed.allowance);
      }
      if (typeof parsed.receivesCommuterAllowance === "boolean") {
        setReceivesCommuterAllowance(parsed.receivesCommuterAllowance);
      }
      if (typeof parsed.commuterAllowanceValue === "string") {
        setCommuterAllowanceValue(parsed.commuterAllowanceValue);
      }
    } catch {
      window.sessionStorage.removeItem(FORM_STATE_STORAGE_KEY);
    } finally {
      setIsRestoredFromStorage(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isRestoredFromStorage) {
      return;
    }

    const stateToPersist: StoredFormState = {
      employmentType,
      incomePeriod,
      income,
      hasChildren,
      childrenUnder18,
      childrenOver18,
      isSingleEarner,
      familyBonus,
      usesTaxableBenefits,
      taxableBenefit,
      companyCarValue,
      allowance,
      receivesCommuterAllowance,
      commuterAllowanceValue,
    };

    window.sessionStorage.setItem(
      FORM_STATE_STORAGE_KEY,
      JSON.stringify(stateToPersist),
    );
  }, [
    allowance,
    childrenOver18,
    childrenUnder18,
    commuterAllowanceValue,
    employmentType,
    familyBonus,
    hasChildren,
    income,
    incomePeriod,
    isRestoredFromStorage,
    isSingleEarner,
    receivesCommuterAllowance,
    taxableBenefit,
    companyCarValue,
    usesTaxableBenefits,
  ]);

  const employmentOptions: EmploymentOption[] = useMemo(
    () =>
      common.employmentOptions.map((option) => ({
        ...option,
        icon: employmentIcons[option.id],
      })),
    [common.employmentOptions],
  );

  const previewGross = useMemo(() => {
    const parsedIncome = Number.parseFloat(income);
    if (Number.isNaN(parsedIncome)) {
      return formatCurrency(0, currencyLocale);
    }

    const monthly =
      incomePeriod === "monthly" ? parsedIncome : parsedIncome / 12;

    return formatCurrency(monthly, currencyLocale);
  }, [income, incomePeriod, currencyLocale]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedChildrenUnder18 = hasChildren
      ? Number.parseInt(childrenUnder18, 10) || 0
      : 0;
    const sanitizedChildrenOver18 = hasChildren
      ? Number.parseInt(childrenOver18, 10) || 0
      : 0;

    const payload: CalculatorInput = {
      employmentType,
      incomePeriod,
      income: Number.parseFloat(income) || 0,
      hasChildren,
      childrenUnder18: sanitizedChildrenUnder18,
      childrenOver18: sanitizedChildrenOver18,
      isSingleEarner: hasChildren ? isSingleEarner : false,
      familyBonus: hasChildren ? familyBonus : "none",
      taxableBenefitsMonthly: usesTaxableBenefits
        ? Number.parseFloat(taxableBenefit) || 0
        : 0,
      companyCarBenefitMonthly: usesTaxableBenefits
        ? Number.parseFloat(companyCarValue) || 0
        : 0,
      allowance: usesTaxableBenefits ? Number.parseFloat(allowance) || 0 : 0,
      receivesCommuterAllowance,
      commuterAllowanceMonthly: receivesCommuterAllowance
        ? Number.parseFloat(commuterAllowanceValue) || 0
        : 0,
    };

    setIsNavigating(true);
    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/result?payload=${encoded}`);
  };

  const handleReset = () => {
    setEmploymentType("employee");
    setIncomePeriod("monthly");
    setIncome("3000");
    setHasChildren(false);
    setChildrenUnder18("0");
    setChildrenOver18("0");
    setIsSingleEarner(false);
    setFamilyBonus("none");
    setUsesTaxableBenefits(false);
    setTaxableBenefit("0");
    setCompanyCarValue("0");
    setAllowance("0");
    setReceivesCommuterAllowance(false);
    setCommuterAllowanceValue("0");
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 pb-12 pt-28">
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-50/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-rose-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-rose-500" style={{ animationDuration: "1s" }}></div>
            </div>
            <p className="text-lg font-semibold text-rose-600">
              {common.nav.calculator === "Calculator" ? "Calculating your net salary..." : "Berechne dein Nettogehalt..."}
            </p>
          </div>
        </div>
      )}
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link href="/faq" className={headerLinkClasses}>
          {common.nav.faq}
        </Link>
        <LanguageToggle />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_auto_1fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-100/80 px-4 py-1 text-sm font-medium text-rose-600">
              {home.badge}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {home.headline}
            </h1>
          </header>

          <section className="rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-white/50">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500">{home.summaryLabel}</p>
                <p className="text-3xl font-semibold text-rose-600">
                  {previewGross} {home.summarySuffix}
                </p>
              </div>
              <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 sm:flex">
                €
              </div>
            </div>
          </section>
        </div>

        <div
          aria-hidden="true"
          className="flex items-center justify-center py-3 lg:py-4"
        >
          <span className="h-px w-full bg-gradient-to-r from-transparent via-rose-200/70 to-transparent lg:hidden" />
          <span className="hidden h-[72%] w-px bg-gradient-to-b from-transparent via-rose-200/70 to-transparent lg:block" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-white/50"
        >
          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {home.stepTitles[0]}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {employmentOptions.map((option) => {
                const Icon = option.icon;
                const active = employmentType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setEmploymentType(option.id)}
                    className={`group flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all ${
                      active
                        ? "border-rose-500 bg-rose-500/10 shadow-lg"
                        : "border-transparent bg-white/70 hover:border-rose-200 hover:bg-rose-50/80"
                    }`}
                  >
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full border ${
                        active
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-rose-100 bg-rose-50 text-rose-600"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {option.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {home.stepTitles[1]}
            </p>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">
                {home.incomeLabels[incomePeriod]}
              </span>
              <div className="relative rounded-2xl bg-white/90 px-4 py-3 shadow-inner ring-1 ring-rose-100/70 focus-within:ring-rose-300">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                  className="w-full border-none bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  placeholder={home.incomePlaceholder}
                  required
                />
              </div>
            </label>
            <div className="flex flex-wrap gap-3">
              {["monthly", "yearly"].map((period) => {
                const periodId = period as IncomePeriod;
                const isActive = incomePeriod === periodId;
                return (
                  <button
                    key={periodId}
                    type="button"
                    onClick={() => setIncomePeriod(periodId)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-rose-500 text-white shadow"
                        : "bg-rose-100/70 text-rose-600 hover:bg-rose-200"
                    }`}
                    aria-pressed={isActive}
                  >
                    {home.incomePeriodLabels[periodId]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {home.stepTitles[2]}
            </p>
            <div className="flex flex-col gap-4 text-sm">
              <p className="font-medium text-slate-700">{home.family.question}</p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                <button
                  type="button"
                  onClick={() => setHasChildren(true)}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    hasChildren
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={hasChildren}
                >
                  {common.responses.yes}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasChildren(false);
                    setChildrenUnder18("0");
                    setChildrenOver18("0");
                    setIsSingleEarner(false);
                    setFamilyBonus("none");
                  }}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    !hasChildren
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={!hasChildren}
                >
                  {common.responses.no}
                </button>
              </div>
            </div>
            {hasChildren && (
              <div className="grid gap-6 rounded-2xl bg-rose-50/60 p-6">
                <div className="grid gap-4 sm:max-w-md">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">
                      {home.family.childrenUnder18}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={childrenUnder18}
                      onChange={(event) => setChildrenUnder18(event.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">
                      {home.family.childrenOver18}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={childrenOver18}
                      onChange={(event) => setChildrenOver18(event.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                    <span className="text-xs text-slate-500">
                      {home.family.childrenOver18Note}
                    </span>
                  </label>
                </div>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-3 text-sm">
                    <span className="font-medium text-slate-700">
                      {home.family.singleEarnerQuestion}
                    </span>
                    <div className="grid gap-3 sm:max-w-md sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setIsSingleEarner(true)}
                        className={`w-full rounded-xl border px-6 py-3 text-center text-sm font-semibold transition ${
                          isSingleEarner
                            ? "border-rose-500 bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30"
                            : "border-rose-200 bg-white/85 text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                        aria-pressed={isSingleEarner}
                      >
                        {common.responses.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSingleEarner(false)}
                        className={`w-full rounded-xl border px-6 py-3 text-center text-sm font-semibold transition ${
                          !isSingleEarner
                            ? "border-rose-500 bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30"
                            : "border-rose-200 bg-white/85 text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                        aria-pressed={!isSingleEarner}
                      >
                        {common.responses.no}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-sm">
                    <span className="font-medium text-slate-700">
                      {home.family.familyBonusTitle}
                    </span>
                    <div className="grid gap-3 sm:max-w-md">
                      {common.familyBonusOptions.map((option) => {
                        const active = familyBonus === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setFamilyBonus(option.id as FamilyBonusOption)
                            }
                            className={`w-full rounded-xl border px-6 py-3 text-left text-sm font-semibold leading-snug transition ${
                              active
                                ? "border-rose-500 bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30"
                                : "border-rose-200 bg-white/85 text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                            }`}
                            aria-pressed={active}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {home.stepTitles[3]}
            </p>
            <div className="flex flex-col gap-4 text-sm">
              <p className="font-medium text-slate-700">{home.benefits.question}</p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                <button
                  type="button"
                  onClick={() => setUsesTaxableBenefits(true)}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    usesTaxableBenefits
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={usesTaxableBenefits}
                >
                  {common.responses.yes}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsesTaxableBenefits(false);
                    setTaxableBenefit("0");
                    setCompanyCarValue("0");
                    setAllowance("0");
                  }}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    !usesTaxableBenefits
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={!usesTaxableBenefits}
                >
                  {common.responses.no}
                </button>
              </div>
            </div>
            {usesTaxableBenefits && (
              <div className="grid gap-6 rounded-2xl bg-rose-50/60 p-6">
                <label className="flex flex-col gap-2 text-sm sm:max-w-md">
                  <span className="font-medium text-slate-700">{home.benefits.taxableBenefit}</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={taxableBenefit}
                    onChange={(event) => setTaxableBenefit(event.target.value)}
                    className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm sm:max-w-md">
                  <span className="font-medium text-slate-700">
                    {home.benefits.companyCar}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={companyCarValue}
                    onChange={(event) => setCompanyCarValue(event.target.value)}
                    className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm sm:max-w-md">
                  <span className="font-medium text-slate-700">{home.benefits.allowance}</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={allowance}
                    onChange={(event) => setAllowance(event.target.value)}
                    className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {home.stepTitles[4]}
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-slate-700">{home.commuter.question}</p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                <button
                  type="button"
                  onClick={() => setReceivesCommuterAllowance(true)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    receivesCommuterAllowance
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={receivesCommuterAllowance}
                >
                  {common.responses.yes}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceivesCommuterAllowance(false);
                    setCommuterAllowanceValue("0");
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    !receivesCommuterAllowance
                      ? "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"
                  }`}
                  aria-pressed={!receivesCommuterAllowance}
                >
                  {common.responses.no}
                </button>
              </div>
            </div>
            {receivesCommuterAllowance && (
              <div className="grid gap-6 rounded-2xl bg-rose-50/60 p-6 text-sm">
                <p className="text-slate-600 sm:max-w-md">{home.commuter.helper}</p>
                <label className="flex flex-col gap-2 text-sm sm:max-w-md">
                  <span className="font-medium text-slate-700">
                    {home.commuter.inputLabel}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={commuterAllowanceValue}
                    onChange={(event) =>
                      setCommuterAllowanceValue(event.target.value)
                    }
                    className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isNavigating}
              className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {home.calculateButton}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isNavigating}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-white px-6 py-3 text-base font-semibold text-rose-600 shadow transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {common.nav.calculator === "Calculator" ? "Reset" : "Zurücksetzen"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
