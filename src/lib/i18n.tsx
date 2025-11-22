import type { ReactNode } from "react";
import type {
  EmploymentType,
  FamilyBonusOption,
  IncomePeriod,
} from "@/lib/calculator";

export type Language = "en" | "de";

export interface Dictionary {
  common: {
    languageNames: Record<Language, string>;
    nav: {
      calculator: string;
      faq: string;
      backToInput: string;
    };
    responses: {
      yes: string;
      no: string;
    };
    currency: {
      locale: string;
      perMonth: string;
      perYear: string;
    };
    employmentOptions: { id: EmploymentType; title: string }[];
    familyBonusOptions: { id: FamilyBonusOption; label: string }[];
  };
  home: {
    badge: string;
    headline: string;
    headlineNetToGross: string;
    description: string;
    summaryLabel: string;
    summarySuffix: string;
    incomePlaceholder: string;
    stepTitles: [string, string, string, string, string];
    incomeLabels: Record<IncomePeriod, string>;
    incomePeriodLabels: Record<IncomePeriod, string>;
    family: {
      question: string;
      childrenUnder18: string;
      childrenOver18: string;
      childrenOver18Note: string;
      singleEarnerQuestion: string;
      familyBonusTitle: string;
    };
    benefits: {
      question: string;
      taxableBenefit: string;
      companyCar: string;
      allowance: string;
    };
    commuter: {
      question: string;
      helper: ReactNode;
      linkLabel: string;
      inputLabel: string;
    };
    calculateButton: string;
  };
  result: {
    headerBadge: string;
    headerTitle: string;
    summaryMetrics: {
      netMonthlyAverage: string;
      netAnnualTotal: string;
      netMonthlyExcludingSpecial: string;
      grossSalaryLabel: string;
      netAnnualExcludingSpecial: string;
      info: {
        netMonthlyAverage: string;
        netAnnualTotal: string;
        netMonthlyExcludingSpecial: string;
        netAnnualExcludingSpecial: string;
      };
      footnotes: {
        netMonthlyAverage: string;
        netAnnualTotal: string;
        netMonthlyExcludingSpecial: string;
        netAnnualExcludingSpecial: string;
      };
    };
    specialPaymentsTitle: string;
    breakdownTitle: string;
    breakdownItems: {
      socialInsurance: {
        title: string;
        description: string;
      };
      incomeTax: {
        title: string;
        description: string;
      };
    };
    analysis: {
      title: string;
      metrics: {
        grossMonthly: string;
        grossAnnual: string;
        net13th: string;
        net14th: string;
      };
      chart: {
        title: string;
        description: string;
        totalGross: string;
        emptyState: string;
        legend: {
          socialInsurance: string;
          incomeTax: string;
          netIncome: string;
        };
      };
    };
    noteSection: {
      title: string;
      paragraphs: string[];
    };
    detailsTitle: string;
    sectionTitles: {
      family: string;
      benefits: string;
      commuter: string;
    };
    labels: {
      employmentType: string;
      gross: Record<IncomePeriod, string>;
      childrenUnder18: string;
      childrenOver18: string;
      childrenOver18Note: string;
      singleEarner: string;
      familyBonus: string;
      taxableBenefit: string;
      companyCar: string;
      allowance: string;
      commuterAllowance: string;
    };
  };
  faq: {
    badge: string;
    title: string;
    description: string;
    notesTitle: string;
    notes: string[];
  };
  footer: {
    text: string;
    highlight: string;
    suffix: string;
    privacyLinkLabel: string;
    changelogLinkLabel: string;
    contactLinkLabel: string;
  };
  changelog: {
    badge: string;
    title: string;
    description: string;
    backLink: string;
  };
  privacy: {
    badge: string;
    title: string;
    intro: string;
    sections: {
      title: string;
      body: string[];
    }[];
    backLink: string;
  };
}

export const LANGUAGE_COOKIE_NAME = "asc_language";

export const translations: Record<Language, Dictionary> = {
  en: {
    common: {
      languageNames: {
        en: "English",
        de: "Deutsch",
      },
      nav: {
        calculator: "Calculator",
        faq: "FAQ",
        backToInput: "Back to input",
      },
      responses: {
        yes: "Yes",
        no: "No",
      },
      currency: {
        locale: "en-AT",
        perMonth: "/ month",
        perYear: "/ year",
      },
      employmentOptions: [
        {
          id: "employee",
          title: "Employee",
        },
        {
          id: "apprentice",
          title: "Apprentice",
        },
        {
          id: "pensioner",
          title: "Pensioner",
        },
      ],
      familyBonusOptions: [
        { id: "none", label: "No family bonus" },
        { id: "shared", label: "Shared family bonus" },
        { id: "full", label: "Full family bonus" },
      ],
    },
    home: {
      badge: "Gross-to-net calculator",
      headline: "Calculate your Austrian net salary.",
      headlineNetToGross: "Calculate your Austrian gross salary.",
      description: "Calculate your exact take-home pay or gross salary in seconds. Our free calculator uses the latest Austrian tax regulations for 2026, including social insurance contributions, income tax brackets, and deductions like the Family Bonus Plus and commuter allowance. Whether you're negotiating a job offer, planning your finances, or comparing salaries across Austria, get precise results for employees, apprentices, and pensioners.",
      summaryLabel: "Currently selected gross salary",
      summarySuffix: "/ month",
      incomePlaceholder: "e.g. 3,000",
      stepTitles: [
        "1. Employment type",
        "2. Income",
        "3. Family situation",
        "4. Benefits & allowances",
        "5. Commuter allowance",
      ],
      incomeLabels: {
        monthly: "Gross salary per month",
        yearly: "Gross salary per year",
      },
      incomePeriodLabels: {
        monthly: "monthly",
        yearly: "annually",
      },
      family: {
        question: "Do you have children?",
        childrenUnder18: "Children up to 17 years",
        childrenOver18:
          "Children from 18 years",
        childrenOver18Note:
          "For whom family allowance is received",
        singleEarnerQuestion: "Single earner or single parent?",
        familyBonusTitle: "Family Bonus Plus",
      },
      benefits: {
        question: "Do you receive non-cash benefits or tax allowances?",
        taxableBenefit: "Non-cash benefit per month",
        companyCar: "Company car benefit per month",
        allowance: "Tax allowance per month",
      },
      commuter: {
        question: "Do you claim a commuter allowance?",
        helper: (
          <>
            For an exact calculation of the commuter allowance, please use the
            official&nbsp;
            <a
              href="https://pendlerrechner.bmf.gv.at"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
            >
              Pendlerrechner (commuter calculator) of the Austrian Ministry of Finance (BMF)
            </a>
            . Then enter the monthly amount here.
          </>
        ),
        linkLabel: "Pendlerrechner (commuter calculator) of the BMF",
        inputLabel: "Commuter allowance per month",
      },
      calculateButton: "Calculate now",
    },
    result: {
      headerBadge: "Result",
      headerTitle: "Your net salary",
      summaryMetrics: {
        netMonthlyAverage: "Avg. net / month",
        netAnnualTotal: "Total net / year",
        netMonthlyExcludingSpecial: "Your net salary",
        grossSalaryLabel: "Your gross salary",
        netAnnualExcludingSpecial: "Net / year",
        info: {
          netMonthlyAverage:
            "Sum of all 14 net payments (incl. 13th and 14th salary) spread across 12 calendar months.",
          netAnnualTotal:
            "Sum of the net amount of all 14 salary payments (incl. 13th and 14th salary).",
          netMonthlyExcludingSpecial:
            "Regular monthly net pay (excl. 13th and 14th salary).",
          netAnnualExcludingSpecial:
            "Sum of the 12 regular net salaries (excl. 13th and 14th salary).",
        },
        footnotes: {
          netMonthlyAverage: "incl. 13th and 14th salary",
          netAnnualTotal: "incl. 13th and 14th salary",
          netMonthlyExcludingSpecial: "excl. 13th and 14th salary",
          netAnnualExcludingSpecial: "excl. 13th and 14th salary",
        },
      },
      specialPaymentsTitle: "13th and 14th salary",
      breakdownTitle: "Taxes & contributions",
      breakdownItems: {
        socialInsurance: {
          title: "Social insurance",
          description:
            "Employee share including health, pension and unemployment insurance.",
        },
        incomeTax: {
          title: "Income tax",
          description:
            "Progressive Austrian income tax after all credits have been applied.",
        },
      },
      analysis: {
        title: "Analysis",
        metrics: {
          grossMonthly: "Gross / month",
          grossAnnual: "Gross / year",
          net13th: "Net 13th salary",
          net14th: "Net 14th salary",
        },
        chart: {
          title: "Where your annual gross salary goes",
          description:
            "How social insurance contributions and income tax impact your yearly gross income.",
          totalGross: "Gross / year",
          emptyState: "Enter a salary to see how it's distributed.",
          legend: {
            socialInsurance: "Social insurance",
            incomeTax: "Income tax",
            netIncome: "Net salary",
          },
        },
      },
      noteSection: {
        title: "Notes on the results",
        paragraphs: [
          "This calculator is for orientation only – no guarantee, no legal advice.",
          "The displayed values assume 14 equal gross monthly salary payments per year. Deviations are possible, e.g. through overtime, tax-free allowances or additional special payments. Certain reductions for older employees regarding unemployment or pension insurance are not considered. Your actual salary may therefore differ from the calculated amount.",
        ],
      },
      detailsTitle: "Your inputs",
      sectionTitles: {
        family: "Family situation",
        benefits: "Benefits & allowances",
        commuter: "Commuter allowance",
      },
      labels: {
        employmentType: "Employment type",
        gross: {
          monthly: "Gross salary per month",
          yearly: "Gross salary per year",
        },
        childrenUnder18: "Children up to 17 years",
        childrenOver18: "Children from 18 years",
        childrenOver18Note: "For whom family allowance is received",
        singleEarner: "Single earner / single parent",
        familyBonus: "Family Bonus Plus",
        taxableBenefit: "Non-cash benefit per month",
        companyCar: "Company car benefit per month",
        allowance: "Tax allowance per month",
        commuterAllowance: "Commuter allowance per month",
      },
    },
    faq: {
      badge: "FAQ",
      title: "Frequently asked questions",
      description:
        "Answers to frequent questions on Austrian net income, taxes and social security contributions.",
      notesTitle: "Notes",
      notes: [
        "Laws change regularly. The relevant law and official information (tax office, social insurance) prevail.",
        "This FAQ is simplified and does not replace legal advice.",
      ],
    },
    footer: {
      text: "Created by",
      highlight: "Aestero Studios",
      suffix: "in Austria.",
      privacyLinkLabel: "Privacy notice",
      changelogLinkLabel: "Changelog",
      contactLinkLabel: "Contact",
    },
    changelog: {
      badge: "Changelog",
      title: "Updates & Improvements",
      description: "Track the latest changes and improvements to the Austrian Salary Calculator.",
      backLink: "Back to the calculator",
    },
    privacy: {
      badge: "Privacy",
      title: "How we handle your data.",
      intro:
        "Transparency matters to us. This notice explains what data we collect and why.",
      sections: [
        {
          title: "Language preference",
          body: [
            "We store a single cookie (asc_language) to remember your language choice (English or German) for up to one year.",
            "You can change languages anytime using the selector at the top-right of every page.",
          ],
        },
        {
          title: "Anonymous usage analytics",
          body: [
            "We use Vercel Analytics to understand how visitors use our calculator. This collects anonymous data such as page views, country/region, browser type, and screen size.",
            "No personal information, IP addresses, or calculation data is collected. All analytics are aggregated and anonymized.",
          ],
        },
        {
          title: "What we don't do",
          body: [
            "We never store or transmit your salary calculations. All calculations happen in your browser and stay on your device.",
            "We don't use advertising cookies, tracking pixels, or third-party data sharing.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You can delete cookies in your browser settings anytime. The site will continue to work without the language cookie (defaulting to English).",
            "If you have any questions, please contact us using the contact link in the footer.",
          ],
        },
      ],
      backLink: "Back to the calculator",
    },
  },
  de: {
    common: {
      languageNames: {
        en: "English",
        de: "Deutsch",
      },
      nav: {
        calculator: "Rechner",
        faq: "FAQ",
        backToInput: "Zurück zur Eingabe",
      },
      responses: {
        yes: "Ja",
        no: "Nein",
      },
      currency: {
        locale: "de-AT",
        perMonth: "/ Monat",
        perYear: "/ Jahr",
      },
      employmentOptions: [
        {
          id: "employee",
          title: "Arbeiter:in / Angestellte:r",
        },
        {
          id: "apprentice",
          title: "Lehrling",
        },
        {
          id: "pensioner",
          title: "Pensionist:in",
        },
      ],
      familyBonusOptions: [
        { id: "none", label: "Kein Familienbonus" },
        { id: "shared", label: "Geteilter Familienbonus" },
        { id: "full", label: "Voller Familienbonus" },
      ],
    },
    home: {
      badge: "Brutto-Netto-Rechner",
      headline: "Berechne dein österreichisches Nettogehalt.",
      headlineNetToGross: "Berechne dein österreichisches Bruttogehalt.",
      description: "Berechnen Sie in Sekunden Ihr exaktes Netto- oder Bruttogehalt. Unser kostenloser Rechner verwendet die aktuellen österreichischen Steuervorschriften für 2026, einschließlich Sozialversicherungsbeiträgen, Einkommensteuerstufen und Abzügen wie dem Familienbonus Plus oder der Pendlerpauschale. Ob Sie ein Jobangebot verhandeln, Ihre Finanzen planen oder Gehälter in Österreich vergleichen – erhalten Sie präzise Ergebnisse für Angestellte, Arbeiter:innen, Lehrlinge und Pensionist:innen.",
      summaryLabel: "Aktuell ausgewähltes Bruttogehalt",
      summarySuffix: "/ Monat",
      incomePlaceholder: "z. B. 3.000",
      stepTitles: [
        "1. Beschäftigungsform",
        "2. Einkommen",
        "3. Familiensituation",
        "4. Sachbezüge & Freibeträge",
        "5. Pendlerpauschale",
      ],
      incomeLabels: {
        monthly: "Bruttogehalt pro Monat",
        yearly: "Bruttogehalt pro Jahr",
      },
      incomePeriodLabels: {
        monthly: "monatlich",
        yearly: "jährlich",
      },
      family: {
        question: "Hast du Kinder?",
        childrenUnder18: "Anzahl Kinder bis 17 Jahre",
        childrenOver18: "Anzahl Kinder ab 18 Jahre",
        childrenOver18Note: "Für welche Familienbeihilfe bezogen wird",
        singleEarnerQuestion: "Alleinverdiener:in bzw. Alleinerzieher:in?",
        familyBonusTitle: "Familienbonus Plus",
      },
      benefits: {
        question:
          "Nimmst du Sachbezüge oder steuerliche Freibeträge in Anspruch?",
        taxableBenefit: "Sachbezug pro Monat",
        companyCar: "Sachbezug durch Firmen-PKW pro Monat",
        allowance: "Steuerlicher Freibetrag pro Monat",
      },
      commuter: {
        question: "Nimmst du eine Pendlerpauschale in Anspruch?",
        helper: (
          <>
            Zur genauen Berechnung der Pendlerpauschale nutzen Sie bitte den&nbsp;
            <a
              href="https://pendlerrechner.bmf.gv.at"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
            >
              Pendlerrechner des BMF
            </a>
            . Tragen Sie anschließend hier den monatlichen Betrag ein.
          </>
        ),
        linkLabel: "Pendlerrechner des BMF",
        inputLabel: "Pendlerpauschale pro Monat",
      },
      calculateButton: "Jetzt berechnen",
    },
    result: {
      headerBadge: "Ergebnis",
      headerTitle: "Dein Nettogehalt",
      summaryMetrics: {
        netMonthlyAverage: "Dschn. Netto / Monat",
        netAnnualTotal: "Gesamt Netto / Jahr",
        netMonthlyExcludingSpecial: "Dein Nettogehalt",
        grossSalaryLabel: "Dein Bruttogehalt",
        netAnnualExcludingSpecial: "Netto / Jahr",
        info: {
          netMonthlyAverage:
            "Summe aller 14 Nettogehälter (inkl. 13. und 14. Gehalt) auf 12 Kalendermonate verteilt.",
          netAnnualTotal:
            "Summe der Nettogehälter aller 14 Gehaltszahlungen (inkl. 13. und 14. Gehalt).",
          netMonthlyExcludingSpecial:
            "Reguläres monatliches Nettoeinkommen (exkl. 13. und 14. Gehalt).",
          netAnnualExcludingSpecial:
            "Summe der 12 regulären Nettoeinkommen (exkl. 13. und 14. Gehalt).",
        },
        footnotes: {
          netMonthlyAverage: "inkl. 13. und 14. Gehalt",
          netAnnualTotal: "inkl. 13. und 14. Gehalt",
          netMonthlyExcludingSpecial: "exkl. 13. und 14. Gehalt",
          netAnnualExcludingSpecial: "exkl. 13. und 14. Gehalt",
        },
      },
      specialPaymentsTitle: "13. und 14. Gehalt",
      breakdownTitle: "Steuern & Abgaben",
      breakdownItems: {
        socialInsurance: {
          title: "Sozialversicherung",
          description:
            "Arbeitnehmer:innenanteil inkl. Kranken-, Pensions- und Arbeitslosenversicherung.",
        },
        incomeTax: {
          title: "Lohnsteuer",
          description:
            "Progressive Steuer nach österreichischem Tarif abzüglich aller Gutschriften.",
        },
      },
      analysis: {
        title: "Analyse",
        metrics: {
          grossMonthly: "Brutto / Monat",
          grossAnnual: "Brutto / jahr",
          net13th: "Netto 13. Gehalt",
          net14th: "Netto 14. Gehalt",
        },
        chart: {
          title: "So verteilt sich dein Jahresbrutto",
          description:
            "Wie sich Abzüge für Sozialversicherung und Lohnsteuer auf dein Jahresbrutto auswirken.",
          totalGross: "Brutto / Jahr",
          emptyState: "Bitte gib ein Gehalt ein, um die Verteilung zu sehen.",
          legend: {
            socialInsurance: "Sozialversicherung",
            incomeTax: "Lohnsteuer",
            netIncome: "Nettogehalt",
          },
        },
      },
      noteSection: {
        title: "Hinweis zu den Ergebnissen",
        paragraphs: [
          "Dieser Brutto-Netto-Rechner dient ausschließlich als Orientierungshilfe – Angaben ohne Gewähr, keine Rechtsberatung.",
          "Die ausgewiesenen Werte gelten bei 14 gleich hohen Brutto-Monatsbezügen. Abweichungen sind möglich, z. B. durch Überstunden, steuerfreie Zulagen oder zusätzliche Sonderzahlungen. Für ältere Arbeitnehmer:innen können unter bestimmten Voraussetzungen Begünstigungen bei Arbeitslosen- und Pensionsversicherung gelten; diese werden hier nicht berücksichtigt. Daher kann dein tatsächliches Nettogehalt vom berechneten Betrag abweichen.",
        ],
      },
      detailsTitle: "Deine Angaben",
      sectionTitles: {
        family: "Familiensituation",
        benefits: "Sachbezüge & Freibeträge",
        commuter: "Pendlerpauschale",
      },
      labels: {
        employmentType: "Beschäftigungsform",
        gross: {
          monthly: "Bruttogehalt pro Monat",
          yearly: "Bruttogehalt pro Jahr",
        },
        childrenUnder18: "Anzahl Kinder bis 17 Jahre",
        childrenOver18: "Anzahl Kinder ab 18 Jahre",
        childrenOver18Note: "Für welche Familienbeihilfe bezogen wird",
        singleEarner: "Alleinverdiener:in / Alleinerzieher:in",
        familyBonus: "Familienbonus Plus",
        taxableBenefit: "Sachbezug pro Monat",
        companyCar: "Sachbezug durch Firmen-PKW pro Monat",
        allowance: "Steuerlicher Freibetrag pro Monat",
        commuterAllowance: "Pendlerpauschale pro Monat",
      },
    },
    faq: {
      badge: "FAQ",
      title: "Häufig gestellte Fragen",
      description:
        "Antworten zu häufigen Fragen rund um Ihr österreichisches Nettoeinkommen sowie Steuern und Abgaben.",
      notesTitle: "Hinweise",
      notes: [
        "Die Gesetze ändern sich immer wieder. Maßgeblich sind die jeweils geltenden Gesetze und offiziellen Informationen (Finanzamt, Sozialversicherung).",
        "Dieses FAQ ist vereinfachend und ersetzt keine Rechtsberatung.",
      ],
    },
    footer: {
      text: "Created by",
      highlight: "Aestero Studios",
      suffix: "in Austria.",
      privacyLinkLabel: "Datenschutzhinweis",
      changelogLinkLabel: "Changelog",
      contactLinkLabel: "Kontakt",
    },
    changelog: {
      badge: "Changelog",
      title: "Updates & Verbesserungen",
      description: "Verfolgen Sie die neuesten Änderungen und Verbesserungen am österreichischen Gehaltsrechner.",
      backLink: "Zurück zum Rechner",
    },
    privacy: {
      badge: "Datenschutz",
      title: "So gehen wir mit Ihren Daten um.",
      intro:
        "Transparenz ist uns wichtig. Dieser Hinweis erklärt, welche Daten wir sammeln und warum.",
      sections: [
        {
          title: "Sprachauswahl",
          body: [
            "Wir speichern genau ein Cookie („asc_language“), um Ihre Sprachauswahl (Deutsch oder Englisch) für bis zu ein Jahr zu speichern.",
            "Sie können die Sprache jederzeit über die Sprachauswahl oben rechts auf jeder Seite ändern.",
          ],
        },
        {
          title: "Anonyme Nutzungsanalyse",
          body: [
            "Wir setzen Vercel Analytics ein, um zu verstehen, wie Besucher:innen unsere Seite nutzen. Erfasst werden ausschließlich anonyme Daten wie Seitenaufrufe, Land/Region, Browsertyp und Bildschirmgröße.",
            "Es werden keine personenbezogenen Daten, keine IP-Adressen und keine Berechnungsdaten erhoben. Sämtliche Auswertungen sind aggregiert und anonymisiert.",
          ],
        },
        {
          title: "Was wir nicht tun",
          body: [
            "Wir speichern oder übertragen niemals Ihre Gehaltsberechnungen. Alle Berechnungen erfolgen ausschließlich in Ihrem Browser und verbleiben auf Ihrem Gerät.",
            "Wir verwenden keine Werbe-Cookies, keine Tracking-Pixel und geben keine Daten an Dritte weiter.",
          ],
        },
        {
          title: "Ihre Rechte",
          body: [
            "Sie können die Cookies jederzeit in Ihren Browser-Einstellungen löschen. Die Seite funktioniert auch ohne das Sprach-Cookie (lädt dann standardmäßig auf Englisch).",
            "Bei Fragen können Sie uns jederzeit mittels des Kontakt-Links im Footer erreichen.",
          ],
        },
      ],
      backLink: "Zurück zum Rechner",
    },
  },
};

export const defaultLanguage: Language = "en";

export function isLanguage(value: string | undefined): value is Language {
  return value === "en" || value === "de";
}

export function getDictionary(language: Language): Dictionary {
  return translations[language];
}
