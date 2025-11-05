"use client";

import Link from "next/link";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { headerLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/button";
import { ToggleGroup } from "@/components/toggle-group";
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
    const hasChildrenData = Number.parseInt(childrenUnder18, 10) > 0 || Number.parseInt(childrenOver18, 10) > 0;
    if (hasChildrenData) setFamilyExpanded(true);
  }, [childrenUnder18, childrenOver18]);

  useEffect(() => {
    const hasBenefitsData =
      Number.parseFloat(taxableBenefit) > 0 ||
      Number.parseFloat(companyCarValue) > 0 ||
      Number.parseFloat(allowance) > 0;
    if (hasBenefitsData) setBenefitsExpanded(true);
  }, [taxableBenefit, companyCarValue, allowance]);

  useEffect(() => {
    const hasCommuterData = Number.parseFloat(commuterAllowanceValue) > 0;
    if (hasCommuterData) setCommuterExpanded(true);
  }, [commuterAllowanceValue]);

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

    // Derive boolean flags from actual values
    const sanitizedChildrenUnder18 = Number.parseInt(childrenUnder18, 10) || 0;
    const sanitizedChildrenOver18 = Number.parseInt(childrenOver18, 10) || 0;
    const derivedHasChildren = sanitizedChildrenUnder18 > 0 || sanitizedChildrenOver18 > 0;

    const sanitizedTaxableBenefit = Number.parseFloat(taxableBenefit) || 0;
    const sanitizedCompanyCarValue = Number.parseFloat(companyCarValue) || 0;
    const sanitizedAllowance = Number.parseFloat(allowance) || 0;

    const sanitizedCommuterAllowance = Number.parseFloat(commuterAllowanceValue) || 0;
    const derivedReceivesCommuterAllowance = sanitizedCommuterAllowance > 0;

    const payload: CalculatorInput = {
      employmentType,
      incomePeriod,
      income: Number.parseFloat(income) || 0,
      calculationMode,
      hasChildren: derivedHasChildren,
      childrenUnder18: sanitizedChildrenUnder18,
      childrenOver18: sanitizedChildrenOver18,
      isSingleEarner: derivedHasChildren ? isSingleEarner : false,
      familyBonus: derivedHasChildren ? familyBonus : "none",
      taxableBenefitsMonthly: sanitizedTaxableBenefit,
      companyCarBenefitMonthly: sanitizedCompanyCarValue,
      allowance: sanitizedAllowance,
      receivesCommuterAllowance: derivedReceivesCommuterAllowance,
      commuterAllowanceMonthly: sanitizedCommuterAllowance,
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
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/faq" className={`${headerLinkClasses} text-sm`}>
              {common.nav.faq}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero */}
        <header className="text-center">
          {/* Social Proof Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 shadow-sm">
            <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-xs font-semibold text-emerald-700">
              {common.nav.calculator === "Calculator"
                ? "Trusted by 3,000+ users"
                : "3.000+ Nutzer:innen vertrauen uns"}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {common.nav.calculator === "Calculator"
              ? "Austrian Salary Calculator"
              : "Österreichischer Gehaltsrechner"}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {common.nav.calculator === "Calculator"
              ? "Gross-to-net or net-to-gross calculator with accurate 2025 Austrian tax rates"
              : "Brutto-Netto oder Netto-Brutto Rechner mit aktuellen österreichischen Steuersätzen für 2025"}
          </p>
        </header>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information - REQUIRED */}
          <div className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-white shadow-xl">
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {common.nav.calculator === "Calculator" ? "Basic Information" : "Grundinformationen"}
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-white/80">
                      {common.nav.calculator === "Calculator" ? "Employment type and salary" : "Beschäftigungsart und Einkommen"}
                    </p>
                  </div>
                </div>
                <div className="hidden rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm sm:block">
                  {common.nav.calculator === "Calculator" ? "REQUIRED" : "ERFORDERLICH"}
                </div>
              </div>
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

              {/* Calculation Mode Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  {common.nav.calculator === "Calculator" ? "What would you like to calculate?" : "Was möchten Sie berechnen?"}
                </label>
                <div className="inline-flex w-full items-center gap-1 rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleCalculationModeChange('gross-to-net')}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                      calculationMode === 'gross-to-net'
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25'
                        : 'text-slate-700 hover:bg-white hover:text-rose-600'
                    }`}
                    aria-pressed={calculationMode === 'gross-to-net'}
                    aria-label={common.nav.calculator === "Calculator" ? "Calculate Net from Gross salary" : "Netto aus Brutto berechnen"}
                  >
                    <span className="block text-xs opacity-75 mb-0.5">
                      {common.nav.calculator === "Calculator" ? "Gross" : "Brutto"} → {common.nav.calculator === "Calculator" ? "Net" : "Netto"}
                    </span>
                    <span className="block">
                      {common.nav.calculator === "Calculator" ? "Net Salary" : "Nettogehalt"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalculationModeChange('net-to-gross')}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                      calculationMode === 'net-to-gross'
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25'
                        : 'text-slate-700 hover:bg-white hover:text-rose-600'
                    }`}
                    aria-pressed={calculationMode === 'net-to-gross'}
                    aria-label={common.nav.calculator === "Calculator" ? "Calculate Gross from Net salary" : "Brutto aus Netto berechnen"}
                  >
                    <span className="block text-xs opacity-75 mb-0.5">
                      {common.nav.calculator === "Calculator" ? "Net" : "Netto"} → {common.nav.calculator === "Calculator" ? "Gross" : "Brutto"}
                    </span>
                    <span className="block">
                      {common.nav.calculator === "Calculator" ? "Gross Salary" : "Bruttogehalt"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Salary Input */}
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-slate-700">
                    {calculationMode === 'gross-to-net'
                      ? home.incomeLabels[incomePeriod]
                      : (incomePeriod === 'monthly'
                        ? (common.nav.calculator === "Calculator" ? "Net salary per month" : "Nettogehalt pro Monat")
                        : (common.nav.calculator === "Calculator" ? "Net salary per year" : "Nettogehalt pro Jahr"))
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
                      inputMode="decimal"
                      min="0"
                      max="500000"
                      step="10"
                      value={income}
                      onChange={(event) => setIncome(event.target.value)}
                      className="block w-full rounded-2xl border-2 border-rose-100 bg-white py-4 pl-10 pr-4 text-lg font-semibold text-slate-900 placeholder:text-slate-400 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                      placeholder={common.nav.calculator === "Calculator" ? "e.g. 3000" : "z.B. 3000"}
                      required
                      aria-required="true"
                      aria-describedby={income && (Number.parseFloat(income) <= 0 || Number.parseFloat(income) > 500000) ? "income-error" : undefined}
                    />
                  </div>
                  {income && Number.parseFloat(income) > 0 && Number.parseFloat(income) > 100000 && (
                    <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                      <span className="text-amber-600 text-sm">⚠️</span>
                      <p className="text-sm text-amber-800">
                        {common.nav.calculator === "Calculator"
                          ? "This is an unusually high salary. Please verify the amount."
                          : "Dies ist ein ungewöhnlich hohes Gehalt. Bitte überprüfen Sie den Betrag."}
                      </p>
                    </div>
                  )}
                  {income && Number.parseFloat(income) <= 0 && (
                    <p id="income-error" className="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <span>❌</span>
                      {common.nav.calculator === "Calculator" ? "Please enter a valid amount (minimum €0.01)" : "Bitte geben Sie einen gültigen Betrag ein (mindestens €0,01)"}
                    </p>
                  )}
                  {income && Number.parseFloat(income) > 500000 && (
                    <p id="income-error" className="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <span>❌</span>
                      {common.nav.calculator === "Calculator" ? "Amount exceeds maximum (€500,000)" : "Betrag überschreitet Maximum (€500.000)"}
                    </p>
                  )}
                </label>
                <ToggleGroup
                  options={[
                    { id: "monthly" as IncomePeriod, label: home.incomePeriodLabels.monthly },
                    { id: "yearly" as IncomePeriod, label: home.incomePeriodLabels.yearly },
                  ]}
                  value={incomePeriod}
                  onChange={setIncomePeriod}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Family (Collapsible) - OPTIONAL */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <button
              type="button"
              onClick={() => setFamilyExpanded(!familyExpanded)}
              aria-expanded={familyExpanded}
              aria-controls="family-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-slate-50 to-slate-50 px-6 py-4 text-left transition-colors hover:from-rose-50/30 hover:to-pink-50/30 sm:px-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <UsersIcon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    {common.nav.calculator === "Calculator" ? "Family Circumstances" : "Familiensituation"}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {common.nav.calculator === "Calculator" ? "Optional" : "Optional"}
                    </span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {common.nav.calculator === "Calculator" ? "Add if you have children" : "Hinzufügen wenn Sie Kinder haben"}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${familyExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
              </div>
            </button>
            {familyExpanded && (
              <div id="family-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="space-y-6 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-sm font-medium text-slate-700">
                          {home.family.childrenUnder18}
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max="20"
                          value={childrenUnder18}
                          onChange={(event) => setChildrenUnder18(event.target.value)}
                          className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                        />
                      </label>
                      <label className="block">
                        <span className="block text-sm font-medium text-slate-700">
                          {home.family.childrenOver18}
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max="20"
                          value={childrenOver18}
                          onChange={(event) => setChildrenOver18(event.target.value)}
                          className="mt-2 block w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
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
                      <div className="inline-flex w-full items-center gap-1 rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-1.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setIsSingleEarner(true)}
                          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                            isSingleEarner
                              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25'
                              : 'text-slate-700 hover:bg-white hover:text-rose-600'
                          }`}
                          aria-pressed={isSingleEarner}
                        >
                          {common.responses.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSingleEarner(false)}
                          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                            !isSingleEarner
                              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25'
                              : 'text-slate-700 hover:bg-white hover:text-rose-600'
                          }`}
                          aria-pressed={!isSingleEarner}
                        >
                          {common.responses.no}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className="block text-sm font-medium text-slate-700">
                        {home.family.familyBonusTitle}
                      </span>
                      <div className="space-y-2.5">
                        {common.familyBonusOptions.map((option) => {
                          const active = familyBonus === option.id;
                          const descriptions = {
                            none: common.nav.calculator === "Calculator" ? "I don't receive this benefit" : "Ich erhalte diese Förderung nicht",
                            shared: common.nav.calculator === "Calculator" ? "Split 50/50 with partner" : "50/50 mit Partner aufgeteilt",
                            full: common.nav.calculator === "Calculator" ? "I claim 100% of the benefit" : "Ich beziehe 100% der Förderung"
                          };
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setFamilyBonus(option.id as FamilyBonusOption)}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-all min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                                active
                                  ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20"
                                  : "border-2 border-rose-100 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                              }`}
                              aria-pressed={active}
                            >
                              <div className="flex-1">
                                <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>
                                  {option.label}
                                </div>
                                <div className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-slate-500'}`}>
                                  {descriptions[option.id as keyof typeof descriptions]}
                                </div>
                              </div>
                              {active && (
                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>

          {/* Section 3: Benefits (Collapsible) - OPTIONAL */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <button
              type="button"
              onClick={() => setBenefitsExpanded(!benefitsExpanded)}
              aria-expanded={benefitsExpanded}
              aria-controls="benefits-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-slate-50 to-slate-50 px-6 py-4 text-left transition-colors hover:from-rose-50/30 hover:to-pink-50/30 sm:px-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <TruckIcon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    {common.nav.calculator === "Calculator" ? "Benefits and Tax Allowances" : "Sachbezüge und steuerliche Freibeträge"}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {common.nav.calculator === "Calculator" ? "Optional" : "Optional"}
                    </span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {common.nav.calculator === "Calculator" ? "Add company car and other benefits" : "Firmenauto und andere Bezüge hinzufügen"}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${benefitsExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
              </div>
            </button>
            {benefitsExpanded && (
              <div id="benefits-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="space-y-4 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.taxableBenefit}</span>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-base font-semibold text-rose-500">€</span>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={taxableBenefit}
                          onChange={(event) => setTaxableBenefit(event.target.value)}
                          className="block w-full rounded-xl border-2 border-rose-100 bg-white pl-10 pr-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                          placeholder="0.00"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.companyCar}</span>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-base font-semibold text-rose-500">€</span>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={companyCarValue}
                          onChange={(event) => setCompanyCarValue(event.target.value)}
                          className="block w-full rounded-xl border-2 border-rose-100 bg-white pl-10 pr-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                          placeholder="0.00"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.benefits.allowance}</span>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-base font-semibold text-rose-500">€</span>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={allowance}
                          onChange={(event) => setAllowance(event.target.value)}
                          className="block w-full rounded-xl border-2 border-rose-100 bg-white pl-10 pr-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                          placeholder="0.00"
                        />
                      </div>
                    </label>
                  </div>
              </div>
            )}
          </div>

          {/* Section 4: Commuter (Collapsible) - OPTIONAL */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <button
              type="button"
              onClick={() => setCommuterExpanded(!commuterExpanded)}
              aria-expanded={commuterExpanded}
              aria-controls="commuter-section-content"
              className="flex w-full items-center justify-between bg-gradient-to-r from-slate-50 to-slate-50 px-6 py-4 text-left transition-colors hover:from-rose-50/30 hover:to-pink-50/30 sm:px-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <MapIcon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    {common.nav.calculator === "Calculator" ? "Commuter Allowance" : "Pendlerpauschale"}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {common.nav.calculator === "Calculator" ? "Optional" : "Optional"}
                    </span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {common.nav.calculator === "Calculator" ? "Add travel deductions if you commute" : "Fahrtkostenabzug bei Pendeln hinzufügen"}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${commuterExpanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
              </div>
            </button>
            {commuterExpanded && (
              <div id="commuter-section-content" className="space-y-6 px-6 py-6 sm:px-8">
                <div className="space-y-4 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6">
                    <p className="text-sm text-slate-600">{home.commuter.helper}</p>
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">{home.commuter.inputLabel}</span>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-base font-semibold text-rose-500">€</span>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={commuterAllowanceValue}
                          onChange={(event) => setCommuterAllowanceValue(event.target.value)}
                          className="block w-full rounded-xl border-2 border-rose-100 bg-white pl-10 pr-4 py-3 text-base text-slate-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                          placeholder="0.00"
                        />
                      </div>
                    </label>
                  </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isNavigating}
              isLoading={isNavigating}
            >
              {calculationMode === 'gross-to-net'
                ? home.calculateButton
                : (common.nav.calculator === "Calculator" ? "Calculate Required Gross" : "Benötigtes Brutto berechnen")
              }
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleReset}
              disabled={isNavigating}
              className="sm:w-auto"
            >
              {common.nav.calculator === "Calculator" ? "Reset" : "Zurücksetzen"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
