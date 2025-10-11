import Link from "next/link";
import { redirect } from "next/navigation";
import {
  calculateNetSalary,
  formatCurrency,
  type CalculatorInput,
} from "@/lib/calculator";

type SearchParams = Record<string, string | string[] | undefined>;

interface ResultPageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

function parsePayload(value: string | string[] | undefined): CalculatorInput | null {
  if (!value) {
    return null;
  }

  const raw = Array.isArray(value) ? value[0] : value;

  try {
    return JSON.parse(decodeURIComponent(raw)) as CalculatorInput;
  } catch {
    try {
      return JSON.parse(raw) as CalculatorInput;
    } catch {
      return null;
    }
  }
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const resolvedSearchParams = await searchParams;
  const payload = parsePayload(resolvedSearchParams?.payload);

  if (!payload) {
    redirect("/");
  }

  const result = calculateNetSalary(payload);

  const grossLabel =
    payload.incomePeriod === "monthly" ? "Monatsbrutto" : "Jahresbrutto";
  const grossInputValue =
    payload.incomePeriod === "monthly"
      ? formatCurrency(result.grossMonthly)
      : formatCurrency(result.grossAnnual);
  const sanitizedChildren = Math.max(payload.children ?? 0, 0);
  const sanitizedAllowance = Math.max(payload.allowance ?? 0, 0);
  const sanitizedCompanyCarValue = Math.max(payload.companyCarValue ?? 0, 0);
  const commutingFrequencyLabels = {
    none: "kein Pendeln",
    upto10: "bis 10 Tage",
    moreThan10: "mehr als 10 Tage",
  } as const;
  const commutingFrequencyLabel =
    commutingFrequencyLabels[payload.commutingFrequency] ?? "unbekannt";

  const summaryMetrics = [
    {
      label: "Netto monatlich",
      value: formatCurrency(result.netMonthly),
      accent: true,
    },
    {
      label: "Netto jährlich",
      value: formatCurrency(result.netAnnual),
    },
    {
      label: grossLabel,
      value:
        payload.incomePeriod === "monthly"
          ? formatCurrency(result.grossMonthly)
          : formatCurrency(result.grossAnnual),
    },
  ];

  const breakdown = [
    {
      title: "Sozialversicherung",
      monthly: formatCurrency(result.socialInsuranceMonthly),
      annual: formatCurrency(result.socialInsuranceAnnual),
      description:
        "Arbeitnehmer:innenanteil inkl. Kranken-, Pensions- und Arbeitslosenversicherung.",
    },
    {
      title: "Lohnsteuer",
      monthly: formatCurrency(result.incomeTaxMonthly),
      annual: formatCurrency(result.incomeTaxAnnual),
      description:
        "Progressive Steuer nach österreichischem Tarif abzüglich aller Gutschriften.",
    },
    {
      title: "Gutschriften",
      monthly: formatCurrency(result.creditsMonthly + result.familyBonusMonthly),
      annual: formatCurrency(result.creditsAnnual + result.familyBonusAnnual),
      description:
        "Alleinverdiener:innen-Absetzbetrag, Verkehrsabsetzbetrag sowie Familienbonus Plus.",
    },
    {
      title: "Pendlerpauschale",
      monthly: formatCurrency(result.commuterAllowanceMonthly),
      annual: formatCurrency(result.commuterAllowanceMonthly * 12),
      description:
        "Direkt vom steuerpflichtigen Einkommen abgezogen (groß/klein je nach Zumutbarkeit).",
    },
  ];

  const contextDetails = [
    {
      label: "Beschäftigung",
      value:
        payload.employmentType === "employee"
          ? "Arbeiter:in / Angestellte:r"
          : payload.employmentType === "apprentice"
            ? "Lehrling"
            : "Pensionist:in",
    },
    {
      label: grossLabel,
      value: grossInputValue,
    },
    {
      label: "Familienbonus",
      value:
        payload.familyBonus === "none"
          ? "kein Familienbonus"
          : payload.familyBonus === "half"
            ? "halber Bonus"
            : "ganzer Bonus",
    },
    {
      label: "Kinder",
      value: String(sanitizedChildren),
    },
    {
      label: "Firmen-PKW",
      value: payload.hasCompanyCar
        ? `${formatCurrency(sanitizedCompanyCarValue)} SB`
        : "kein Sachbezug",
    },
    {
      label: "Freibetrag",
      value: formatCurrency(sanitizedAllowance),
    },
    {
      label: "Pendlerstrecke",
      value: `${payload.commuterDistance} km (${payload.publicTransportReasonable ? "Öffis zumutbar" : "Öffis nicht zumutbar"}, ${commutingFrequencyLabel})`,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50/60 px-6 py-16">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-rose-100/60 bg-white/90 shadow-[0_30px_70px_rgba(241,71,133,0.15)] backdrop-blur">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/70 to-rose-100/80" />
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">Ergebnis</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-[3rem]">
                  Dein Nettogehalt
                </h1>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-rose-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm transition-colors hover:border-rose-300 hover:text-rose-700"
              >
                Zurück zur Eingabe
              </Link>
            </div>

            <section className="grid gap-4 sm:grid-cols-3">
              {summaryMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`group relative overflow-hidden rounded-[2rem] border border-rose-100/60 bg-white/95 p-[1px] shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    metric.accent ? "border-transparent bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/40" : ""
                  }`}
                >
                  <div
                    className={`relative flex h-full flex-col justify-between gap-4 rounded-[1.7rem] p-6 sm:p-7 ${
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
                      className={`text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-tight tracking-tight ${
                        metric.accent ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {metric.value}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Aufschlüsselung monatlich / jährlich
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {breakdown.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-full flex-col gap-4 rounded-2xl border border-rose-100/70 bg-white/85 p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="text-sm font-semibold text-rose-600">
                      {item.title}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      <span className="text-[clamp(1.7rem,2.4vw,2.2rem)] leading-tight tracking-tight">
                        {item.monthly}
                      </span>
                      <span className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        / Monat
                      </span>
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      <span className="font-semibold text-slate-600">{item.annual}</span> pro Jahr
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500/80">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 rounded-[2rem] border border-rose-100/70 bg-white/95 p-8 shadow-lg">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
                Deine Angaben
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-slate-600">
                {contextDetails.map((detail) => (
                  <li
                    key={detail.label}
                    className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm"
                  >
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-400">
                      {detail.label}
                    </span>
                    <span className="break-words text-base text-slate-700">{detail.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-rose-500 via-rose-500/95 to-rose-600 p-8 text-white shadow-2xl">
              <h3 className="text-xl font-semibold tracking-tight">Was wurde berücksichtigt?</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                Wir ziehen Sozialversicherung, progressive Lohnsteuer, Pendlerpauschale, Sachbezug sowie Familienbonus und Alleinverdiener:innen-Absetzbeträge in einer einzigen Berechnung zusammen.
              </p>
              <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/75">
                Ergebnis basiert auf deinen Angaben und dient als Orientierung.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
