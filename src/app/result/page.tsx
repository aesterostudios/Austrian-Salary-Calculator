import Link from "next/link";
import { redirect } from "next/navigation";
import {
  calculateNetSalary,
  formatCurrency,
  type CalculatorInput,
} from "@/lib/calculator";

interface ResultPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  const resolvedParams = await searchParams;
  const payload = parsePayload(resolvedParams?.payload);

  if (!payload) {
    redirect("/");
  }

  const result = calculateNetSalary(payload);

  const grossLabel =
    payload.incomePeriod === "monthly" ? "Monatsbrutto" : "Jahresbrutto";

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
      value:
        payload.incomePeriod === "monthly"
          ? formatCurrency(payload.income)
          : formatCurrency(payload.income),
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
      value: String(payload.children ?? 0),
    },
    {
      label: "Firmen-PKW",
      value: payload.hasCompanyCar
        ? `${formatCurrency(payload.companyCarValue)} SB`
        : "kein Sachbezug",
    },
    {
      label: "Freibetrag",
      value: formatCurrency(payload.allowance ?? 0),
    },
    {
      label: "Pendlerstrecke",
      value: `${payload.commuterDistance} km (${payload.publicTransportReasonable ? "Öffis zumutbar" : "Öffis nicht zumutbar"})`,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white/85 shadow-2xl backdrop-blur">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50 to-rose-100" />
        <div className="relative grid gap-12 p-10 lg:grid-cols-[1.15fr_1fr] lg:p-16">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Dein Ergebnis
              </h1>
              <Link
                href="/"
                className="rounded-full border border-rose-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-rose-600 shadow hover:border-rose-300"
              >
                Zurück zur Eingabe
              </Link>
            </div>
            <p className="text-base text-slate-600">
              Auf Basis deiner Angaben spiegeln wir die Logik des Arbeiterkammer-Rechners und zeigen die wichtigsten Kennzahlen transparent an.
            </p>

            <section className="grid gap-4 sm:grid-cols-3">
              {summaryMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-2xl border border-white/60 bg-white/80 p-6 shadow ${metric.accent ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/40" : "text-slate-700"}`}
                >
                  <p
                    className={`text-sm font-medium uppercase tracking-[0.2em] ${metric.accent ? "text-white/70" : "text-rose-500"}`}
                  >
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Aufschlüsselung monatlich / jährlich
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {breakdown.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-inner"
                  >
                    <p className="text-sm font-semibold text-rose-600">
                      {item.title}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {item.monthly}
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        / Monat
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.annual} pro Jahr
                    </p>
                    <p className="mt-3 text-xs text-slate-500/80">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl bg-white/90 p-8 shadow-lg ring-1 ring-white/60">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                Deine Angaben
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-slate-600">
                {contextDetails.map((detail) => (
                  <li key={detail.label} className="flex flex-col gap-1 rounded-xl bg-rose-50/60 p-3">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">
                      {detail.label}
                    </span>
                    <span className="text-base text-slate-700">{detail.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold">Was wurde berücksichtigt?</h3>
              <p className="mt-3 text-sm text-white/80">
                Wir ziehen Sozialversicherung, progressive Lohnsteuer, Pendlerpauschale, Sachbezug sowie Familienbonus und Alleinverdiener:innen-Absetzbeträge in einer einzigen Berechnung zusammen.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/70">
                Ergebnis basiert auf deinen Angaben und dient als Orientierung.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
