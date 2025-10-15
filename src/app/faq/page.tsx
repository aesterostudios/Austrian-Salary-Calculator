import Link from "next/link";
import { headerLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";

const faqs = [
  {
    question:
      "Wieso macht es einen Unterschied, ob ich Arbeiter:in/Angestellte:r, Lehrling oder Pensionist:in bin?",
    answer: (
      <div className="space-y-3 text-left text-slate-600">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-slate-900">Arbeiter:innen und Angestellte:</strong> Die Beiträge zur Sozialversicherung
            sind derzeit ähnlich hoch. Unterschiede entstehen eher durch Kollektivvertrag, Zuschläge oder Abfertigung
            (Geldleistung bei Beendigung des Dienstverhältnisses). Für die Nettoberechnung ist es trotzdem wichtig, die
            korrekte Gruppe anzugeben.
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
            <strong className="text-slate-900">Familienbonus Plus</strong> von 700 Euro pro Jahr (etwa 58,34 Euro pro Monat).
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
          <strong className="text-slate-900">Pendlereuro</strong> (siehe unten).
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

export default function FAQPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 pb-16 pt-28">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link href="/" className={headerLinkClasses}>
          Rechner
        </Link>
        <LanguageToggle />
      </div>
      <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-400">FAQ</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Häufig gestellte Fragen
        </h1>
        <p className="text-sm text-slate-500">
          Entdecke Antworten zu häufigen Themen rund um den Brutto-Netto-Rechner – strukturiert, präzise und schnell
          nachlesbar.
        </p>
      </div>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.3)] transition hover:border-rose-200 hover:shadow-[0_18px_45px_-22px_rgba(244,114,182,0.35)]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold text-slate-900 transition group-open:text-rose-500">
              <span>{faq.question}</span>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 transition group-open:border-rose-200 group-open:bg-rose-50 group-open:text-rose-500">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <div className="mt-4 border-t border-slate-100 pt-4 text-base leading-relaxed">{faq.answer}</div>
          </details>
        ))}
      </section>
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-rose-200/60 bg-rose-50/70 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Hinweise</p>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-rose-600">
          <p>
            Die Regeln ändern sich immer wieder. Maßgeblich sind die jeweils geltenden Gesetze und offiziellen Informationen
            (Finanzamt, Sozialversicherung).
          </p>
          <p>Dieses FAQ ist vereinfachend und ersetzt keine Rechtsberatung.</p>
        </div>
      </section>
    </main>
  );
}
