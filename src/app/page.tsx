"use client";

import type { ComponentType, FormEvent, SVGProps } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BuildingOffice2Icon,
  AcademicCapIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import type {
  CalculatorInput,
  EmploymentType,
  FamilyBonusOption,
  IncomePeriod,
  CommutingFrequency,
} from "@/lib/calculator";

const employmentOptions: {
  id: EmploymentType;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    id: "employee",
    title: "Arbeiter:in / Angestellte:r",
    description: "Standard ASVG-Beschäftigung mit allen Abgaben.",
    icon: BuildingOffice2Icon,
  },
  {
    id: "apprentice",
    title: "Lehrling",
    description: "Reduzierte SV-Sätze für Lehrverhältnisse.",
    icon: AcademicCapIcon,
  },
  {
    id: "pensioner",
    title: "Pensionist:in",
    description: "Berechnung für gesetzliche Pensionen.",
    icon: HeartIcon,
  },
];

const familyBonusOptions: { id: FamilyBonusOption; label: string }[] = [
  { id: "none", label: "kein Familienbonus" },
  { id: "half", label: "halber Familienbonus" },
  { id: "full", label: "ganzer Familienbonus" },
];

const commutingFrequencyOptions: {
  id: CommutingFrequency;
  label: string;
  description: string;
}[] = [
  { id: "none", label: "0 Tage", description: "kein Pendeln" },
  {
    id: "upto10",
    label: "bis 10 Tage",
    description: "unregelmäßiges Pendeln",
  },
  {
    id: "moreThan10",
    label: "mehr als 10 Tage",
    description: "regelmäßiges Pendeln",
  },
];

export default function Home() {
  const router = useRouter();
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    "employee",
  );
  const [incomePeriod, setIncomePeriod] = useState<IncomePeriod>("monthly");
  const [income, setIncome] = useState<string>("3500");
  const [isSingleEarner, setIsSingleEarner] = useState<boolean>(false);
  const [familyBonus, setFamilyBonus] = useState<FamilyBonusOption>("none");
  const [children, setChildren] = useState<string>("0");
  const [hasCompanyCar, setHasCompanyCar] = useState<boolean>(false);
  const [companyCarValue, setCompanyCarValue] = useState<string>("400");
  const [allowance, setAllowance] = useState<string>("0");
  const [commuterDistance, setCommuterDistance] = useState<string>("0");
  const [publicTransportReasonable, setPublicTransportReasonable] =
    useState<boolean>(true);
  const [commutingFrequency, setCommutingFrequency] =
    useState<CommutingFrequency>("moreThan10");

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

    const payload: CalculatorInput = {
      employmentType,
      incomePeriod,
      income: Number.parseFloat(income) || 0,
      isSingleEarner,
      familyBonus,
      children: Number.parseInt(children, 10) || 0,
      hasCompanyCar,
      companyCarValue: hasCompanyCar
        ? Number.parseFloat(companyCarValue) || 0
        : 0,
      allowance: Number.parseFloat(allowance) || 0,
      commuterDistance: Number.parseFloat(commuterDistance) || 0,
      publicTransportReasonable,
      commutingFrequency,
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
            <header className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-100/80 px-4 py-1 text-sm font-medium text-rose-600">
                Online Brutto-Netto-Rechner
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Berechne dein österreichisches Netto-Gehalt in zwei Schritten.
              </h1>
              <p className="text-base text-slate-600">
                Wir spiegeln die Funktionen des AK-Rechners und verpacken sie in ein modernes, fokussiertes Interface.
              </p>
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

            <p className="text-sm text-slate-500">
              Zwei Screens genügen: gib deine Daten ein und sieh das Ergebnis auf der nächsten Seite.
            </p>
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
                      className={`group flex flex-col gap-3 rounded-xl border p-4 text-left transition-all ${active ? "border-rose-500 bg-rose-500/10 shadow-lg" : "border-transparent bg-white/70 hover:border-rose-200 hover:bg-rose-50/80"}`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-600"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {option.title}
                        </p>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                2. Einkommen
              </p>
              <div className="flex flex-wrap gap-3">
                {["monthly", "yearly"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setIncomePeriod(period as IncomePeriod)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${incomePeriod === period ? "bg-rose-500 text-white shadow" : "bg-rose-100/70 text-rose-600 hover:bg-rose-200"}`}
                  >
                    {period === "monthly" ? "monatlich" : "jährlich"}
                  </button>
                ))}
              </div>
              <label className="flex flex-col gap-2 text-sm">
                Brutto {incomePeriod === "monthly" ? "pro Monat" : "pro Jahr"}
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                  className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  required
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={isSingleEarner}
                  onChange={(event) => setIsSingleEarner(event.target.checked)}
                  className="h-4 w-4 rounded border-rose-300 text-rose-500 focus:ring-rose-500"
                />
                Alleinverdiener:in / Alleinerzieher:in
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Anzahl Kinder für Steuerabsetzbeträge
                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(event) => setChildren(event.target.value)}
                  className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                3. Steuerliche Begünstigungen
              </p>
              <label className="flex flex-col gap-2 text-sm">
                Familienbonus Plus
                <select
                  value={familyBonus}
                  onChange={(event) =>
                    setFamilyBonus(event.target.value as FamilyBonusOption)
                  }
                  className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  {familyBonusOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  Freibetrag monatlich (€)
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={allowance}
                    onChange={(event) => setAllowance(event.target.value)}
                    className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={hasCompanyCar}
                      onChange={(event) => setHasCompanyCar(event.target.checked)}
                      className="h-4 w-4 rounded border-rose-300 text-rose-500 focus:ring-rose-500"
                    />
                    Sachbezug durch Firmen-PKW
                  </label>
                  {hasCompanyCar && (
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={companyCarValue}
                      onChange={(event) => setCompanyCarValue(event.target.value)}
                      placeholder="Sachbezugswert pro Monat"
                      className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                4. Pendlerpauschale
              </p>
              <label className="flex flex-col gap-2 text-sm">
                Einfache Wegstrecke (km)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={commuterDistance}
                  onChange={(event) => setCommuterDistance(event.target.value)}
                  className="w-full rounded-xl border border-rose-200/80 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
              <div className="flex gap-4 text-sm font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setPublicTransportReasonable(true)}
                  className={`flex-1 rounded-xl border px-4 py-3 transition ${publicTransportReasonable ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                >
                  Öffi-Nutzung zumutbar
                </button>
                <button
                  type="button"
                  onClick={() => setPublicTransportReasonable(false)}
                  className={`flex-1 rounded-xl border px-4 py-3 transition ${!publicTransportReasonable ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                >
                  Öffis nicht zumutbar
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {commutingFrequencyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCommutingFrequency(option.id)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${commutingFrequency === option.id ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-transparent bg-rose-100/60 text-rose-600 hover:border-rose-200"}`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-rose-500/80">{option.description}</p>
                  </button>
                ))}
              </div>
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
