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

  const grossInputLabel =
    payload.incomePeriod === "monthly"
      ? "Bruttoeinkommen pro Monat"
      : "Bruttoeinkommen pro Jahr";
  const grossInputValue =
    payload.incomePeriod === "monthly"
      ? formatCurrency(result.grossMonthly)
      : formatCurrency(result.grossAnnual);
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
  const familyBonusLabels = {
    none: "kein Familienbonus",
    shared: "geteilter Familienbonus",
    full: "voller Familienbonus",
  } as const;
  const familyBonusLabel =
    familyBonusLabels[payload.familyBonus] ?? familyBonusLabels.none;

  const summaryMetrics = [
    {
      label: "Netto monatlich",
      value: formatCurrency(result.netMonthly),
      accent: true,
    },
    {
      label: "Netto jährlich",
      value: formatCurrency(result.netAnnual),
      accent: true,
    },
    {
      label: "Brutto monatlich",
      value: formatCurrency(result.grossMonthly),
    },
    {
      label: "Brutto jährlich",
      value: formatCurrency(result.grossAnnual),
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
        "Vom steuerpflichtigen Einkommen abgezogen – laut Eingabe nach Pendlerrechner.",
    },
  ];

  const contextSections: {
    title: string | null;
    items: { label: string; value: string }[];
  }[] = [
    {
      title: null as string | null,
      items: [
        {
          label: "Beschäftigungsform",
          value:
            payload.employmentType === "employee"
              ? "Arbeiter:in / Angestellte:r"
              : payload.employmentType === "apprentice"
                ? "Lehrling"
                : "Pensionist:in",
        },
        {
          label: grossInputLabel,
          value: grossInputValue,
        },
      ],
    },
    {
      title: "Familiensituation",
      items: [
        {
          label: "Anzahl Kinder bis 17 Jahre",
          value: hasChildren ? String(sanitizedChildrenUnder18) : "0",
        },
        {
          label: "Anzahl Kinder ab 18 Jahre",
          value: hasChildren ? String(sanitizedChildrenOver18) : "0",
        },
        {
          label: "Alleinverdiener:in / Alleinerzieher:in",
          value: hasChildren && payload.isSingleEarner ? "Ja" : "Nein",
        },
        {
          label: "Familienbonus Plus",
          value: hasChildren ? familyBonusLabel : familyBonusLabels.none,
        },
      ],
    },
    {
      title: "Sachbezüge & Freibeträge",
      items: [
        {
          label: "Sachbezug (monatlich)",
          value: formatCurrency(sanitizedTaxableBenefit),
        },
        {
          label: "Sachbezug durch Firmen-PKW (monatlich)",
          value: formatCurrency(sanitizedCompanyCarValue),
        },
        {
          label: "Steuerlicher Freibetrag (monatlich)",
          value: formatCurrency(sanitizedAllowance),
        },
      ],
    },
    {
      title: "Pendlerpauschale",
      items: [
        {
          label: "Pendlerpauschale (monatlich)",
          value: payload.receivesCommuterAllowance
            ? formatCurrency(sanitizedCommuterAllowance)
            : formatCurrency(0),
        },
      ],
    },
  ];

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">Ergebnis</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-[3rem]">
                Dein Nettogehalt
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center self-center rounded-full border border-rose-200/70 bg-white/90 px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-[0_12px_30px_rgba(244,114,182,0.15)] transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 whitespace-nowrap sm:self-auto"
            >
              Zurück zur Eingabe
            </Link>
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
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </section>

          <section className="grid gap-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Steuern & Abgaben
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
                      / Monat
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    <span className="font-semibold text-slate-600">{item.annual}</span> pro Jahr
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500/80">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/70 p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
              Hinweis zu den Ergebnissen
            </h2>
            <p className="text-xs leading-relaxed text-rose-600">
              Dieser Brutto-Netto-Rechner dient ausschließlich als Orientierungshilfe – Angaben ohne Gewähr, keine Rechtsberatung.
              <br />
              Die ausgewiesenen Werte gelten bei 14 gleich hohen Monatsbezügen. Abweichungen sind möglich, z. B. durch Überstunden, steuerfreie Zulagen oder zusätzliche Sonderzahlungen. Für ältere Arbeitnehmer:innen können unter bestimmten Voraussetzungen Begünstigungen bei Arbeitslosen- und Pensionsversicherung gelten; diese werden hier nicht berücksichtigt. Daher kann dein tatsächliches Nettogehalt vom berechneten Betrag abweichen.
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-6 self-start rounded-[2rem] border border-rose-100/70 bg-white/95 p-8 shadow-lg">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose-500">
              Deine Angaben
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
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
