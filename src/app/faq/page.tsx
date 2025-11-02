"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { headerPrimaryLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/i18n";

interface FaqItem {
  question: string;
  answer: ReactNode;
}

function getFaqs(language: Language): FaqItem[] {
  if (language === "de") {
    return [
      {
        question:
          "Wieso macht es einen Unterschied, ob ich Arbeiter:in/Angestellte:r, Lehrling oder Pensionist:in bin?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-slate-900">Arbeiter:innen und Angestellte:</strong> Die Beiträge zur Sozialversicherung
                sind derzeit ähnlich hoch. Unterschiede entstehen eher durch Kollektivvertrag, Zuschläge oder Abfertigung
                (Geldleistung bei Beendigung des Dienstverhältnisses).
              </li>
              <li>
                <strong className="text-slate-900">Lehrlinge:</strong> Zahlen insgesamt geringere Sozialversicherungsbeiträge.
                Dadurch bleibt vom Bruttolohn mehr Netto übrig.
              </li>
              <li>
                <strong className="text-slate-900">Pensionist:innen:</strong> Auch Pensionen können lohnsteuerpflichtig sein. Es
                gibt aber besondere Steuerabsetzbeträge für Pensionen, die automatisch berücksichtigt werden.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: "Welche Rolle spielen Kinder bis 17 Jahre für die Berechnung des Nettogehalts?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>
              Vor allem über <strong className="text-slate-900">Steuerabsetzbeträge</strong> (das sind Beträge, die direkt deine
              Einkommensteuer reduzieren):
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-slate-900">Familienbonus Plus:</strong> Bis zum 18. Geburtstag 2.000 Euro pro Kind und Jahr
                (ungefähr 166,68 Euro pro Monat). Der Bonus kann die Steuer bis auf null senken, aber nicht die Sozialversicherung.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: "Welche Rolle spielen Kinder ab 18 Jahre, für die Familienbeihilfe bezogen wird?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Für volljährige Kinder, solange Familienbeihilfe zusteht, gibt es den reduzierten
                <strong className="text-slate-900"> Familienbonus Plus</strong> von 700 Euro pro Jahr (etwa 58,34 Euro pro Monat).
                Ohne Familienbeihilfe gibt es keinen Familienbonus.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: "Was ist ein:e Alleinverdiener:in oder Alleinerzieher:in?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-slate-900">Alleinverdiener:in:</strong> Mehr als sechs Monate im Jahr verheiratet, in
                eingetragener Partnerschaft oder in Lebensgemeinschaft mit mindestens einem Kind (für das Familienbeihilfe bezogen
                wird) und der:die Partner:in verdient höchstens 7.284 Euro im Jahr.
              </li>
              <li>
                <strong className="text-slate-900">Alleinerzieher:in:</strong> Mehr als sechs Monate im Jahr mit mindestens einem
                Kind (Familienbeihilfe) im gemeinsamen Haushalt ohne Partner:in.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: "Müssen Alleinverdiener:innen und Alleinerzieher:innen weniger Steuern und Abgaben zahlen?",
        answer: (
          <div className="space-y-4 text-left text-slate-600">
            <p>
              <strong className="text-slate-900">Sozialversicherung:</strong> Nein, die Beiträge bleiben gleich.
            </p>
            <div className="space-y-3">
              <p>
                <strong className="text-slate-900">Einkommensteuer:</strong> Ja, sie bekommen eigene Steuerabsetzbeträge
                (Alleinverdiener:innen-/Alleinerzieher:innen-Absetzbetrag). Richtwerte 2025:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong className="text-slate-900">1 Kind:</strong> 601 Euro/Jahr
                </li>
                <li>
                  <strong className="text-slate-900">2 Kinder:</strong> 813 Euro/Jahr
                </li>
                <li>
                  <strong className="text-slate-900">3 Kinder:</strong> 1.081 Euro/Jahr (jedes weitere Kind: + 268 Euro/Jahr)
                </li>
              </ul>
              <p className="leading-relaxed">
                Bei sehr niedrigen Einkommen kann es zusätzlich Auszahlungen geben (
                <strong className="text-slate-900">Kindermehrbetrag</strong>).
              </p>
            </div>
          </div>
        ),
      },
      {
        question: "Was ist der Familienbonus Plus?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>
              Ein <strong className="text-slate-900">Steuerabsetzbetrag pro Kind</strong>:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>2.000 Euro/Jahr bis zum 18. Geburtstag,</li>
              <li>700 Euro/Jahr danach, solange Familienbeihilfe bezogen wird.</li>
            </ul>
            <p>Er reduziert direkt deine Steuer (nicht die Sozialversicherung).</p>
          </div>
        ),
      },
      {
        question: "Wann bekomme ich den vollen Familienbonus und wann den geteilten Familienbonus?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-slate-900">Voller Bonus:</strong> Eine anspruchsberechtigte Person nutzt 100 % des Bonus.
              </li>
              <li>
                <strong className="text-slate-900">Geteilter Bonus:</strong> Der Bonus kann zwischen zwei anspruchsberechtigten
                Personen aufgeteilt werden (typisch 50/50). Die Berücksichtigung erfolgt entweder laufend über die Lohnverrechnung
                beim Arbeitgeber oder im Rahmen der jährlichen Steuererklärung.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: "Was sind Sachbezüge?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>
              Sachbezüge sind <strong className="text-slate-900">nicht-geldliche Vorteile</strong> aus dem Job, die wie Einkommen
              behandelt werden.
            </p>
            <p>
              Beispiele: Dienstwohnung, verbilligtes Essen, Privatnutzung von Firmenhandy oder Firmenlaptop, Firmenauto. Sie
              erhöhen den steuer- und sozialversicherungspflichtigen Bezug nach fixen Regeln.
            </p>
          </div>
        ),
      },
      {
        question: "Was sind Sachbezüge durch Firmen-PKW (Firmenauto)?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>Wenn du ein Firmenauto auch privat nutzt, wird ein monatlicher Sachbezugswert angesetzt:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>2 % der Anschaffungskosten (maximal 960 Euro/Monat),</li>
              <li>
                1,5 % (maximal 720 Euro/Monat), wenn der CO₂-Ausstoß des Autos unter einem gesetzlich definierten Grenzwert liegt
                (2025: 126 g/km).
              </li>
              <li>0 Euro bei Elektro- oder Wasserstoffautos (keine Emissionen).</li>
            </ul>
            <p>
              Bei sehr geringer Privatnutzung kann der Sachbezug halbiert werden, wenn du das nachweist (zum Beispiel mit einem
              Fahrtenbuch).
            </p>
            <p>
              <span className="font-semibold text-slate-900">Hinweis:</span> CO₂-Grenzwert laut WLTP-Prüfverfahren; das ist das
              standardisierte Messverfahren für den Ausstoß von Autos.
            </p>
          </div>
        ),
      },
      {
        question: "Was ist der steuerliche Freibetrag?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>
              Gemeint ist meist der <strong className="text-slate-900">Freibetragsbescheid</strong>: Das Finanzamt berücksichtigt
              vorausschauend deine Werbungskosten (zum Beispiel Arbeitsmittel), Sonderausgaben oder außergewöhnlichen Belastungen
              schon unterjährig.
            </p>
            <p>
              Dadurch wird monatlich weniger Lohnsteuer abgezogen und dein Netto steigt. Festgelegt wird das auf Basis deiner
              letzten Steuererklärung.
            </p>
          </div>
        ),
      },
      {
        question: "Was ist die Pendlerpauschale und unter welchen Umständen bekomme ich sie?",
        answer: (
          <div className="space-y-3 text-left text-slate-600">
            <p>
              Die <strong className="text-slate-900">Pendlerpauschale</strong> ist ein pauschaler Steuerabsetzbetrag für den
              Arbeitsweg zwischen Wohnung und Arbeitsstätte. Zusätzlich gibt es den
              <strong className="text-slate-900"> Pendlereuro</strong> (siehe unten).
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-slate-900">Kleine Pendlerpauschale</strong> (öffentliche Verkehrsmittel sind zumutbar): ab
                20 km einfacher Strecke; fixe Monatsbeträge je Distanzstufe.
              </li>
              <li>
                <strong className="text-slate-900">Große Pendlerpauschale</strong> (öffentliche Verkehrsmittel sind nicht zumutbar,
                etwa wegen fehlender Verbindungen): ab 2 km; höhere Monatsbeträge je Distanzstufe.
              </li>
              <li>
                <strong className="text-slate-900">Pendlereuro:</strong> Jahresbetrag = einfache Entfernung in km × 2 Euro. Dieser
                Betrag wird direkt von der Steuer abgezogen.
              </li>
            </ul>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Monatliche Voraussetzungen:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>11 oder mehr Arbeitstage im Monat: voller Anspruch,</li>
                <li>8–10 Tage: zwei Drittel,</li>
                <li>4–7 Tage: ein Drittel.</li>
              </ul>
            </div>
            <p>
              Wichtig: Kein Anspruch, wenn du für den Arbeitsweg ein Firmenauto nutzt. Die Pendlerpauschale und der Pendlereuro
              werden entweder über die Lohnverrechnung berücksichtigt oder über die Steuererklärung.
            </p>
          </div>
        ),
      },
    ];
  }

  return [
    {
      question: "Why does it matter whether I’m an employee, apprentice or pensioner?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Employees:</strong> The employee share of social
              insurance is currently similar between white-collar employees (Angestellte:r) and blue-collar workers (Arbeiter:innen), but collective agreements, supplements and severance pay (Abfertigung) differ.
            </li>
            <li>
              <strong className="text-slate-900">Apprentices:</strong> Pay lower social insurance contributions overall,
              so more of the gross salary remains as net.
            </li>
            <li>
              <strong className="text-slate-900">Pensioners:</strong> Pension payments can be subject to income
              tax, but special pension tax credits are applied automatically.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How do children up to 17 years old influence the net salary calculation?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>
            Mainly through <strong className="text-slate-900">tax credits</strong> that reduce your income tax directly:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Family Bonus Plus:</strong> EUR 2,000 per child and year until the 18th birthday
              (roughly EUR 166.68 per month). It can reduce your tax to zero but does not touch social insurance.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "What about children aged 18+ who still receive the family allowance?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              As long as the family allowance is paid, you receive the reduced
              <strong className="text-slate-900"> Family Bonus Plus</strong> of EUR 700 per year (about EUR 58.34 per month). Without
              the allowance there is no family bonus.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "Who qualifies as a single earner or single parent?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Single earner:</strong> Married, in a registered partnership or
              cohabiting for more than six months with at least one child that receives the family allowance while the partner earns no more than
              EUR 7,284 per year.
            </li>
            <li>
              <strong className="text-slate-900">Single parent:</strong> Living for more than six months with at
              least one child receiving the family allowance, without a partner in the household.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "Do single earners or single parents pay less tax and contributions?",
      answer: (
        <div className="space-y-4 text-left text-slate-600">
          <p>
            <strong className="text-slate-900">Social insurance:</strong> No, the contributions remain the same.
          </p>
          <div className="space-y-3">
            <p>
              <strong className="text-slate-900">Income tax:</strong> Yes, specific tax credits apply. Guide values for 2025:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-slate-900">1 child:</strong> EUR 601 per year
              </li>
              <li>
                <strong className="text-slate-900">2 children:</strong> EUR 813 per year
              </li>
              <li>
                <strong className="text-slate-900">3 children:</strong> EUR 1,081 per year (each additional child: + EUR 268 per year)
              </li>
            </ul>
            <p className="leading-relaxed">
              Very low incomes can also trigger payments such as the
              <strong className="text-slate-900"> Kindermehrbetrag</strong> (additional child allowance).
            </p>
          </div>
        </div>
      ),
    },
    {
      question: "What is the Family Bonus Plus?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>
            A <strong className="text-slate-900">tax credit per child</strong>:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>EUR 2,000 per year until the 18th birthday,</li>
            <li>EUR 700 per year afterwards while the family allowance is paid.</li>
          </ul>
          <p>It directly reduces income tax (not social insurance contributions).</p>
        </div>
      ),
    },
    {
      question: "When do I receive the full family bonus and when the shared bonus?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Full bonus:</strong> One eligible person uses 100% of the benefit.
            </li>
            <li>
              <strong className="text-slate-900">Shared bonus:</strong> Two eligible persons split the bonus (typically 50/50). It
              is taken into account via payroll or through the annual tax return.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "What are non-cash benefits?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>
            Non-cash benefits are <strong className="text-slate-900">benefits in kind</strong> from your job that are treated like
            income.
          </p>
          <p>
            Examples include subsidised housing, discounted meals, private use of a company phone or laptop, or a company car. They
            increase the taxable and social-insurance base according to fixed rules.
          </p>
        </div>
      ),
    },
    {
      question: "What are company car benefits?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>If you also use a company car privately, a monthly non-cash value is applied:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>2% of the purchase price (max. EUR 960 per month),</li>
            <li>
              1.5% (max. EUR 720 per month) if the car’s CO₂ emissions stay below the legal threshold (126 g/km in 2025).
            </li>
            <li>0 EUR for electric or hydrogen cars (zero emissions).</li>
          </ul>
          <p>
            With very little private use the benefit can be halved if you can prove it (e.g. with a logbook).
          </p>
          <p>
            <span className="font-semibold text-slate-900">Note:</span> CO₂ limits follow the WLTP testing procedure, the
            standardised measurement for car emissions.
          </p>
        </div>
      ),
    },
    {
      question: "What is the tax allowance?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>
            Usually this refers to the <strong className="text-slate-900">Freibetragsbescheid</strong>: the tax office anticipates
            your deductible expenses (Werbungskosten), special expenses or extraordinary burdens during the year.
          </p>
          <p>
            Less income tax is withheld each month, so your net pay increases. The amount is based on your most recent tax return.
          </p>
        </div>
      ),
    },
    {
      question: "What is the commuter allowance and when can I claim it?",
      answer: (
        <div className="space-y-3 text-left text-slate-600">
          <p>
            The <strong className="text-slate-900">Pendlerpauschale</strong> (commuter allowance) is a flat tax credit for commuting between home and
            workplace. There is also the <strong className="text-slate-900">Pendlereuro</strong> (see below).
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Small Pendlerpauschale:</strong> Public transport is reasonable; starts at 20 km
              one-way distance with fixed monthly amounts per distance bracket.
            </li>
            <li>
              <strong className="text-slate-900">Large Pendlerpauschale:</strong> Public transport is unreasonable (e.g. no usable
              connections); starts at 2 km with higher monthly amounts per distance bracket.
            </li>
            <li>
              <strong className="text-slate-900">Pendlereuro:</strong> Annual amount equals one-way kilometres × EUR 2 and is
              deducted directly from the income tax.
            </li>
          </ul>
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">Monthly requirements:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>11 or more workdays: full entitlement,</li>
              <li>8–10 days: two thirds,</li>
              <li>4–7 days: one third.</li>
            </ul>
          </div>
          <p>
            Important: No entitlement if you use a company car for the commute. The Pendlerpauschale and Pendlereuro are applied via
            payroll or through the annual tax return.
          </p>
        </div>
      ),
    },
  ];
}

export default function FAQPage() {
  const { language, dictionary } = useLanguage();
  const { common, faq } = dictionary;
  const faqs = useMemo(() => getFaqs(language), [language]);

  return (
    <main className="relative mx-auto min-h-screen w-full px-4 pb-20 pt-6 sm:px-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-rose-100/50 bg-white/80 backdrop-blur-xl print:hidden sm:-mx-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className={`inline-flex items-center gap-2 ${headerPrimaryLinkClasses} text-sm`}>
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{common.nav.calculator === "Calculator" ? "Back to the calculator" : "Zurück zum Rechner"}</span>
              <span className="sm:hidden">{common.nav.calculator === "Calculator" ? "Back" : "Zurück"}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
              {faq.badge}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {faq.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">{faq.description}</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faqItem) => (
            <details
              key={faqItem.question}
              className="group overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 text-left transition-colors hover:from-rose-50 hover:to-pink-50 sm:px-8">
                <span className="text-base font-semibold text-slate-900 sm:text-lg group-open:text-rose-600">
                  {faqItem.question}
                </span>
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-rose-200 bg-white text-sm font-bold text-rose-500 transition group-open:bg-rose-500 group-open:text-white">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <div className="border-t border-rose-100/60 px-6 py-6 text-base leading-relaxed sm:px-8">
                {faqItem.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Notes Section */}
        <div className="rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-600">{faq.notesTitle}</p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {faq.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
