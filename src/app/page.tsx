"use client";

import type { ComponentType, FormEvent, SVGProps } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

const employmentOptions: {
  id: EmploymentType;
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    id: "employee",
    title: "Arbeiter:in / Angestellte:r",
    icon: BuildingOffice2Icon,
  },
  {
    id: "apprentice",
    title: "Lehrling",
    icon: AcademicCapIcon,
  },
  {
    id: "pensioner",
    title: "Pensionist:in",
    icon: UserIcon,
  },
];

const familyBonusOptions: { id: FamilyBonusOption; label: string }[] = [
  { id: "none", label: "kein Familienbonus" },
  { id: "shared", label: "geteilter Familienbonus" },
  { id: "full", label: "voller Familienbonus" },
];

export default function Home() {
  const router = useRouter();
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
  const [usesTaxableBenefits, setUsesTaxableBenefits] = useState<boolean>(false);
  const [taxableBenefit, setTaxableBenefit] = useState<string>("0");
  const [companyCarValue, setCompanyCarValue] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [receivesCommuterAllowance, setReceivesCommuterAllowance] =
    useState<boolean>(false);
  const [commuterAllowanceValue, setCommuterAllowanceValue] =
    useState<string>("0");

  const previewGross = useMemo(() => {
    const parsedIncome = Number.parseFloat(income);
    if (Number.isNaN(parsedIncome)) {
      return "€ 0,00";
    }

    const monthly =
      incomePeriod === "monthly" ? parsedIncome : parsedIncome / 12;

    return new Intl.NumberFormat("de-AT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(monthly);
  }, [income, incomePeriod]);

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

    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/result?payload=${encoded}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white/80 shadow-xl backdrop-blur">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-rose-100" />
        <div className="relative grid gap-12 p-10 lg:grid-cols-[1.2fr_1fr] lg:p-16">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-100/80 px-4 py-1 text-sm font-medium text-rose-600">
                Brutto-Netto-Rechner
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Berechne dein österreichisches Nettogehalt.
              </h1>
            </header>

            <section className="rounded-2xl bg-white/70 p-6 shadow-inner ring-1 ring-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Aktuell ausgewähltes Bruttogehalt</p>
                  <p className="text-3xl font-semibold text-rose-600">{previewGross} / Monat</p>
                </div>
                <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 sm:flex">
                  €
                </div>
              </div>
            </section>

            <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-rose-200/70 to-transparent lg:block" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-white/50"
          >
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                1. Beschäftigungsform
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
                      className={`group flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all ${active ? "border-rose-500 bg-rose-500/10 shadow-lg" : "border-transparent bg-white/70 hover:border-rose-200 hover:bg-rose-50/80"}`}
                    >
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full border ${active ? "border-rose-500 bg-rose-500 text-white" : "border-rose-100 bg-rose-50 text-rose-600"}`}
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
                2. Einkommen
              </p>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-slate-700">
                  Brutto {incomePeriod === "monthly" ? "pro Monat" : "pro Jahr"}
                </span>
                <div className="relative rounded-2xl bg-white/90 px-4 py-3 shadow-inner ring-1 ring-rose-100/70 focus-within:ring-rose-300">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={income}
                    onChange={(event) => setIncome(event.target.value)}
                    className="w-full border-none bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="z. B. 3.000"
                    required
                  />
                </div>
              </label>
              <div className="flex flex-wrap gap-3">
                {["monthly", "yearly"].map((period) => {
                  const isActive = incomePeriod === period;
                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setIncomePeriod(period as IncomePeriod)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-rose-500 text-white shadow" : "bg-rose-100/70 text-rose-600 hover:bg-rose-200"}`}
                      aria-pressed={isActive}
                    >
                      {period === "monthly" ? "monatlich" : "jährlich"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                3. Familiensituation
              </p>
              <div className="flex flex-col gap-4 text-sm">
                <p className="font-medium text-slate-700">Hast du Kinder?</p>
                <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                  <button
                    type="button"
                    onClick={() => setHasChildren(true)}
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${hasChildren ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={hasChildren}
                  >
                    Ja
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
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${!hasChildren ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={!hasChildren}
                  >
                    Nein
                  </button>
                </div>
              </div>
              {hasChildren && (
                <div className="grid gap-6 rounded-2xl bg-rose-50/60 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-slate-700">
                        Anzahl Kinder bis 17 Jahre
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
                        Anzahl Kinder ab 18 Jahre
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={childrenOver18}
                        onChange={(event) => setChildrenOver18(event.target.value)}
                        className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                      <span className="text-xs text-slate-500">
                        Für welche Familienbeihilfe bezogen wird
                      </span>
                    </label>
                  </div>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-3 text-sm">
                      <span className="font-medium text-slate-700">
                        Alleinverdiener:in bzw. Alleinerzieher:in?
                      </span>
                      <div className="grid grid-cols-2 gap-2 sm:max-w-[15rem]">
                        <button
                          type="button"
                          onClick={() => setIsSingleEarner(true)}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${isSingleEarner ? "border-rose-500 bg-white text-rose-600 shadow-[0_4px_18px_rgba(244,63,94,0.18)]" : "border-rose-200 bg-white/80 text-rose-500 hover:border-rose-300 hover:bg-white"}`}
                          aria-pressed={isSingleEarner}
                        >
                          Ja
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSingleEarner(false)}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${!isSingleEarner ? "border-rose-500 bg-white text-rose-600 shadow-[0_4px_18px_rgba(244,63,94,0.18)]" : "border-rose-200 bg-white/80 text-rose-500 hover:border-rose-300 hover:bg-white"}`}
                          aria-pressed={!isSingleEarner}
                        >
                          Nein
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <span className="font-medium text-slate-700">
                        Familienbonus Plus
                      </span>
                      <div className="grid gap-3 sm:max-w-md">
                        {familyBonusOptions.map((option) => {
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
                4. Sachbezüge & Freibeträge
              </p>
              <div className="flex flex-col gap-4 text-sm">
                <p className="font-medium text-slate-700">
                  Nimmst du Sachbezüge oder steuerliche Freibeträge in Anspruch?
                </p>
                <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                  <button
                    type="button"
                    onClick={() => setUsesTaxableBenefits(true)}
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${usesTaxableBenefits ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={usesTaxableBenefits}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsesTaxableBenefits(false);
                      setTaxableBenefit("0");
                      setCompanyCarValue("0");
                      setAllowance("0");
                    }}
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${!usesTaxableBenefits ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={!usesTaxableBenefits}
                  >
                    Nein
                  </button>
                </div>
              </div>
              {usesTaxableBenefits && (
                <div className="grid gap-4 rounded-2xl bg-rose-50/60 p-6">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">Sachbezug (monatlich)</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={taxableBenefit}
                      onChange={(event) => setTaxableBenefit(event.target.value)}
                      className="w-full rounded-xl border border-rose-200/70 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">
                      Sachbezug durch Firmen-PKW (monatlich)
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
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">Steuerlicher Freibetrag (monatlich)</span>
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
                5. Pendlerpauschale
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <p className="font-medium text-slate-700">
                  Nimmst du eine Pendlerpauschale in Anspruch?
                </p>
                <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                  <button
                    type="button"
                    onClick={() => setReceivesCommuterAllowance(true)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${receivesCommuterAllowance ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={receivesCommuterAllowance}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReceivesCommuterAllowance(false);
                      setCommuterAllowanceValue("0");
                    }}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${!receivesCommuterAllowance ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                    aria-pressed={!receivesCommuterAllowance}
                  >
                    Nein
                  </button>
                </div>
              </div>
              {receivesCommuterAllowance && (
                <div className="grid gap-3 rounded-2xl bg-rose-50/60 p-5 text-sm">
                  <p className="text-slate-600">
                    Zur genauen Berechnung der Pendlerpauschale nutze bitte den&nbsp;
                    <a
                      href="https://pendlerrechner.bmf.gv.at"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
                    >
                      Pendlerrechner des BMF
                    </a>
                    . Trage anschließend hier den monatlichen Betrag ein.
                  </p>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-700">
                      Pendlerpauschale (monatlich)
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

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
            >
              Jetzt berechnen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
