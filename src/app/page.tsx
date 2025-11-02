"use client";

import Link from "next/link";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { headerLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { YesNoToggle } from "@/components/yes-no-toggle";
import { useLanguage } from "@/components/language-provider";
import {
  BuildingOffice2Icon,
  AcademicCapIcon,
  UserIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TruckIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import type {
  CalculatorInput,
  EmploymentType,
  FamilyBonusOption,
  IncomePeriod,
  CalculationMode,
} from "@/lib/calculator";

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

  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    "employee",
  );
  const [incomePeriod, setIncomePeriod] = useState<IncomePeriod>("monthly");
  const [income, setIncome] = useState<string>("");
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
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("gross-to-net");
  const [familyExpanded, setFamilyExpanded] = useState(false);
  const [benefitsExpanded, setBenefitsExpanded] = useState(false);
  const [commuterExpanded, setCommuterExpanded] = useState(false);

  // Debounce timer for sessionStorage saves
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-expand sections if they have data
  useEffect(() => {
    if (hasChildren) setFamilyExpanded(true);
  }, [hasChildren]);

  useEffect(() => {
    if (usesTaxableBenefits) setBenefitsExpanded(true);
  }, [usesTaxableBenefits]);

  useEffect(() => {
    if (receivesCommuterAllowance) setCommuterExpanded(true);
  }, [receivesCommuterAllowance]);

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

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Debounce the save operation
    saveTimerRef.current = setTimeout(() => {
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
    }, 500); // 500ms debounce

    // Cleanup on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
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
      calculationMode,
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

  const handleCalculationModeChange = (newMode: CalculationMode) => {
    if (newMode !== calculationMode) {
      setCalculationMode(newMode);
      // Reset income when switching modes to avoid confusion
      setIncome("");
    }
  };

  const handleReset = () => {
    setEmploymentType("employee");
    setIncomePeriod("monthly");
    setIncome("");
    setCalculationMode("gross-to-net");
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
    <main className="relative mx-auto min-h-screen w-full px-4 pb-20 pt-6 sm:px-6">
      {isNavigating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-rose-50/90 backdrop-blur-md"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-20 w-20" aria-hidden="true">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-rose-200"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-rose-500" style={{ animationDuration: "0.8s" }}></div>
            </div>
            <p className="text-base font-medium text-rose-600">
              {common.nav.calculator === "Calculator" ? "Calculating..." : "Berechne..."}
            </p>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-rose-100/50 bg-white/80 backdrop-blur-xl sm:-mx-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/faq" className={`${headerLinkClasses} text-sm`}>
              {common.nav.faq}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur">
              <button
                type="button"
                onClick={() => handleCalculationModeChange('gross-to-net')}
                className={`rounded-full px-2 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 ${
                  calculationMode === 'gross-to-net'
                    ? 'bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]'
                    : 'text-rose-600/80 hover:text-rose-700'
                }`}
                aria-pressed={calculationMode === 'gross-to-net'}
                aria-label={common.nav.calculator === "Calculator" ? "Gross to Net" : "Brutto zu Netto"}
              >
                <span className="hidden sm:inline whitespace-nowrap">
                  {common.nav.calculator === "Calculator" ? "Gross → Net" : "Brutto → Netto"}
                </span>
                <span className="sm:hidden whitespace-nowrap">
                  {common.nav.calculator === "Calculator" ? "Gr→Ne" : "Br→Ne"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleCalculationModeChange('net-to-gross')}
                className={`rounded-full px-2 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 ${
                  calculationMode === 'net-to-gross'
                    ? 'bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]'
                    : 'text-rose-600/80 hover:text-rose-700'
                }`}
                aria-pressed={calculationMode === 'net-to-gross'}
                aria-label={common.nav.calculator === "Calculator" ? "Net to Gross" : "Netto zu Brutto"}
              >
                <span className="hidden sm:inline whitespace-nowrap">
                  {common.nav.calculator === "Calculator" ? "Net → Gross" : "Netto → Brutto"}
                </span>
                <span className="sm:hidden whitespace-nowrap">
                  {common.nav.calculator === "Calculator" ? "Ne→Gr" : "Ne→Br"}
                </span>
              </button>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {calculationMode === 'gross-to-net' ? home.headline : home.headlineNetToGross}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {calculationMode === 'gross-to-net'
              ? (common.nav.calculator === "Calculator"
                ? "Calculate your net take-home pay from your gross salary"
                : "Berechne dein Nettogehalt aus deinem Bruttogehalt")
              : (common.nav.calculator === "Calculator"
                ? "Calculate your gross salary from your net take-home pay"
                : "Berechne dein Bruttogehalt aus deinem Netto-Einkommen")
            }
          </p>
        </header>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Basic Information */}
          <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-5 sm:px-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ClipboardDocumentListIcon className="h-5 w-5 text-rose-500" />
                {common.nav.calculator === "Calculator" ? "Basic Information" : "Grundinformationen"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {common.nav.calculator === "Calculator" ? "Employment type and salary" : "Beschäftigungsart und Gehalt"}
              </p>
            </div>
            <div className="space-y-6 px-6 py-6 sm:px-8">
              {/* Employment Type */}
              <div className="grid gap-3 sm:grid-cols-3">
                {employmentOptions.map((option) => {
                  const Icon = option.icon;
                  const active = employmentType === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setEmploymentType(option.id)}
                      className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200 ${
                        active
                          ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl shadow-rose-500/10"
                          : "border-rose-100 bg-white hover:border-rose-300 hover:shadow-lg"
                      }`}
                    >
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                          active
                            ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30"
                            : "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                        }`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <p className={`text-sm font-semibold ${active ? 'text-rose-700' : 'text-slate-900'}`}>
                        {option.title}
                      </p>
                      {active && (
                        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Salary Input */}
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-slate-700">
                    {calculationMode === 'gross-to-net'
                      ? home.incomeLabels[incomePeriod]
                      : (incomePeriod === 'monthly'
                        ? (common.nav.calculator === "Calculator" ? "Desired Net Monthly Salary" : "Gewünschtes Netto Monatsgehalt")
                        : (common.nav.calculator === "Calculator" ? "Desired Net Annual Salary" : "Gewünschtes Netto Jahresgehalt"))
                    }
                    {" "}
                    <span className="text-rose-500" aria-label="required">*</span>
                  </span>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-lg font-semibold text-rose-500">€</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10000000"
                      step="1"
                      value={income}
                      onChange={(event) => setIncome(event.target.value)}
                      className="block w-full rounded-2xl border-2 border-rose-100 bg-white py-4 pl-10 pr-4 text-lg font-semibold text-slate-900 placeholder:text-slate-400 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 invalid:border-red-300 invalid:ring-red-500/10"
                      placeholder={common.nav.calculator === "Calculator" ? "Enter amount" : "Betrag eingeben"}
                      required
                      aria-required="true"
                      aria-invalid={Number.parseFloat(income) <= 0}
                    />
                  </div>
                  {Number.parseFloat(income) <= 0 && income !== "" && (
                    <p className="mt-1 text-sm text-red-600">
                      {common.nav.calculator === "Calculator" ? "Please enter a valid salary amount" : "Bitte geben Sie einen gültigen Gehaltsbetrag ein"}
                    </p>
                  )}
                </label>
                <div className="flex gap-2">
                  {["monthly", "yearly"].map((period) => {
                    const periodId = period as IncomePeriod;
                    const isActive = incomePeriod === periodId;
                    return (
                      <button
                        key={periodId}
                        type="button"
                        onClick={() => setIncomePeriod(periodId)}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                        aria-pressed={isActive}
                      >
                        {home.incomePeriodLabels[periodId]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Family (Collapsible) */}
          <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => setFamilyExpanded(!familyExpanded)}
              aria-expanded={familyExpanded}
              aria-controls="family-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
            >
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <UsersIcon className="h-5 w-5 text-rose-500" />
                  {common.nav.calculator === "Calculator" ? "Family & Tax Credits" : "Familie & Steuerabsetzbeträge"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {common.nav.calculator === "Calculator" ? "Optional - Add if applicable" : "Optional - Falls zutreffend"}
                </p>
              </div>
              <div className={`transform transition-transform duration-200 ${familyExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-rose-500" />
              </div>
            </button>
            {familyExpanded && (
              <div id="family-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span>{home.family.question}</span>
                </div>
                <YesNoToggle
                  value={hasChildren}
                  onChange={(value) => {
                    setHasChildren(value);
                    if (!value) {
                      setChildrenUnder18("0");
                      setChildrenOver18("0");
                      setIsSingleEarner(false);
                      setFamilyBonus("none");
                    }
                  }}
                />
                {hasChildren && (
                  <div className="space-y-6 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-sm font-medium text-slate-700">
                          {home.family.childrenUnder18}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={childrenUnder18}
                          onChange={(event) => setChildrenUnder18(event.target.value)}
                          className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 invalid:border-red-300"
                        />
                      </label>
                      <label className="block">
                        <span className="block text-sm font-medium text-slate-700">
                          {home.family.childrenOver18}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={childrenOver18}
                          onChange={(event) => setChildrenOver18(event.target.value)}
                          className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 invalid:border-red-300"
                        />
                        <span className="mt-1 block text-xs text-slate-500">
                          {home.family.childrenOver18Note}
                        </span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <span className="block text-sm font-medium text-slate-700">
                        {home.family.singleEarnerQuestion}
                      </span>
                      <YesNoToggle value={isSingleEarner} onChange={setIsSingleEarner} />
                    </div>
                    <div className="space-y-3">
                      <span className="block text-sm font-medium text-slate-700">
                        {home.family.familyBonusTitle}
                      </span>
                      <div className="space-y-2">
                        {common.familyBonusOptions.map((option) => {
                          const active = familyBonus === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setFamilyBonus(option.id as FamilyBonusOption)}
                              className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                                active
                                  ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
                                  : "border-2 border-rose-100 bg-white text-rose-600 hover:border-rose-300"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Benefits (Collapsible) */}
          <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => setBenefitsExpanded(!benefitsExpanded)}
              aria-expanded={benefitsExpanded}
              aria-controls="benefits-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
            >
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <TruckIcon className="h-5 w-5 text-rose-500" />
                  {common.nav.calculator === "Calculator" ? "Taxable Benefits" : "Sachbezüge"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {common.nav.calculator === "Calculator" ? "Optional - Company car, allowances" : "Optional - Firmenauto, Zulagen"}
                </p>
              </div>
              <div className={`transform transition-transform duration-200 ${benefitsExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-rose-500" />
              </div>
            </button>
            {benefitsExpanded && (
              <div id="benefits-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span>{home.benefits.question}</span>
                </div>
                <YesNoToggle
                  value={usesTaxableBenefits}
                  onChange={(value) => {
                    setUsesTaxableBenefits(value);
                    if (!value) {
                      setTaxableBenefit("0");
                      setCompanyCarValue("0");
                      setAllowance("0");
                    }
                  }}
                />
                {usesTaxableBenefits && (
                  <div className="space-y-4 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.taxableBenefit}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={taxableBenefit}
                        onChange={(event) => setTaxableBenefit(event.target.value)}
                        className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.companyCar}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={companyCarValue}
                        onChange={(event) => setCompanyCarValue(event.target.value)}
                        className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.allowance}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={allowance}
                        onChange={(event) => setAllowance(event.target.value)}
                        className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Commuter (Collapsible) */}
          <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => setCommuterExpanded(!commuterExpanded)}
              aria-expanded={commuterExpanded}
              aria-controls="commuter-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8"
            >
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <MapIcon className="h-5 w-5 text-rose-500" />
                  {common.nav.calculator === "Calculator" ? "Commuter Allowance" : "Pendlerpauschale"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {common.nav.calculator === "Calculator" ? "Optional - Travel deductions" : "Optional - Fahrtkosten"}
                </p>
              </div>
              <div className={`transform transition-transform duration-200 ${commuterExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-rose-500" />
              </div>
            </button>
            {commuterExpanded && (
              <div id="commuter-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span>{home.commuter.question}</span>
                </div>
                <YesNoToggle
                  value={receivesCommuterAllowance}
                  onChange={(value) => {
                    setReceivesCommuterAllowance(value);
                    if (!value) {
                      setCommuterAllowanceValue("0");
                    }
                  }}
                />
                {receivesCommuterAllowance && (
                  <div className="space-y-4 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <p className="text-sm text-slate-600">{home.commuter.helper}</p>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.commuter.inputLabel}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={commuterAllowanceValue}
                        onChange={(event) => setCommuterAllowanceValue(event.target.value)}
                        className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={isNavigating}
              className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-rose-500/30 transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-2xl hover:shadow-rose-500/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {calculationMode === 'gross-to-net'
                ? home.calculateButton
                : (common.nav.calculator === "Calculator" ? "Calculate Required Gross" : "Benötigtes Brutto berechnen")
              }
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isNavigating}
              className="rounded-2xl border-2 border-rose-200 bg-white px-8 py-4 text-lg font-bold text-rose-600 shadow-lg transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {common.nav.calculator === "Calculator" ? "Reset" : "Zurücksetzen"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
