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
      netMonthly: string;
      netAnnual: string;
      grossMonthly: string;
      grossAnnual: string;
      footnote: string;
    };
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
        { id: "none", label: "no family bonus" },
        { id: "shared", label: "shared family bonus" },
        { id: "full", label: "full family bonus" },
      ],
    },
    home: {
      badge: "Gross-to-net calculator",
      headline: "Calculate your Austrian net salary.",
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
          "For whom family allowance (Familienbeihilfe) is paid",
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
        question: "Do you claim the commuter allowance?",
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
        netMonthly: "Net monthly",
        netAnnual: "Net annually",
        grossMonthly: "Gross monthly",
        grossAnnual: "Gross annually",
        footnote: "including 13th and 14th salary",
      },
      breakdownTitle: "Taxes & contributions",
      breakdownItems: {
        socialInsurance: {
          title: "Social insurance",
          description:
            "Employee share including health, pension and unemployment insurance (Sozialversicherung).",
        },
        incomeTax: {
          title: "Income tax",
          description:
            "Progressive Austrian income tax (Lohnsteuer) after all credits have been applied.",
        },
      },
      noteSection: {
        title: "Notes on the results",
        paragraphs: [
          "This gross-to-net calculator is for orientation only – no guarantee, no legal advice.",
          "The displayed values assume 14 equal salary payments per year. Deviations are possible, e.g. through overtime, tax-free allowances or additional special payments. Certain reductions for older employees regarding unemployment or pension insurance are not considered. Your actual net salary may therefore differ from the calculated amount.",
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
          monthly: "Gross income per month",
          yearly: "Gross income per year",
        },
        childrenUnder18: "Children up to 17 years",
        childrenOver18: "Children from 18 years",
        childrenOver18Note: "For whom family allowance (Familienbeihilfe) is paid",
        singleEarner: "Single earner / single parent",
        familyBonus: "Family Bonus Plus",
        taxableBenefit: "Non-cash benefit per month",
        companyCar: "Company car benefit per month",
        allowance: "Tax allowance per month",
        commuterAllowance: "Pendlerpauschale per month",
      },
    },
    faq: {
      badge: "FAQ",
      title: "Frequently asked questions",
      description:
        "Answers about Austrian net income, taxes and social security contributions.",
      notesTitle: "Notes",
      notes: [
        "Rules change regularly. The relevant law and official information (tax office, social insurance) prevail.",
        "This FAQ is simplified and does not replace legal advice.",
      ],
    },
    footer: {
      text: "Created by",
      highlight: "Aestero Studios",
      suffix: "in Austria.",
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
        { id: "none", label: "kein Familienbonus" },
        { id: "shared", label: "geteilter Familienbonus" },
        { id: "full", label: "voller Familienbonus" },
      ],
    },
    home: {
      badge: "Brutto-Netto-Rechner",
      headline: "Berechne dein österreichisches Nettogehalt.",
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
        monthly: "Brutto pro Monat",
        yearly: "Brutto pro Jahr",
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
        taxableBenefit: "Sachbezug (monatlich)",
        companyCar: "Sachbezug durch Firmen-PKW (monatlich)",
        allowance: "Steuerlicher Freibetrag (monatlich)",
      },
      commuter: {
        question: "Nimmst du eine Pendlerpauschale in Anspruch?",
        helper: (
          <>
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
          </>
        ),
        linkLabel: "Pendlerrechner des BMF",
        inputLabel: "Pendlerpauschale (monatlich)",
      },
      calculateButton: "Jetzt berechnen",
    },
    result: {
      headerBadge: "Ergebnis",
      headerTitle: "Dein Nettogehalt",
      summaryMetrics: {
        netMonthly: "Netto monatlich",
        netAnnual: "Netto jährlich",
        grossMonthly: "Brutto monatlich",
        grossAnnual: "Brutto jährlich",
        footnote: "inkl. 13. und 14. Gehalt",
      },
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
      noteSection: {
        title: "Hinweis zu den Ergebnissen",
        paragraphs: [
          "Dieser Brutto-Netto-Rechner dient ausschließlich als Orientierungshilfe – Angaben ohne Gewähr, keine Rechtsberatung.",
          "Die ausgewiesenen Werte gelten bei 14 gleich hohen Monatsbezügen. Abweichungen sind möglich, z. B. durch Überstunden, steuerfreie Zulagen oder zusätzliche Sonderzahlungen. Für ältere Arbeitnehmer:innen können unter bestimmten Voraussetzungen Begünstigungen bei Arbeitslosen- und Pensionsversicherung gelten; diese werden hier nicht berücksichtigt. Daher kann dein tatsächliches Nettogehalt vom berechneten Betrag abweichen.",
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
          monthly: "Bruttoeinkommen pro Monat",
          yearly: "Bruttoeinkommen pro Jahr",
        },
        childrenUnder18: "Anzahl Kinder bis 17 Jahre",
        childrenOver18: "Anzahl Kinder ab 18 Jahre",
        childrenOver18Note: "Für welche Familienbeihilfe bezogen wird",
        singleEarner: "Alleinverdiener:in / Alleinerzieher:in",
        familyBonus: "Familienbonus Plus",
        taxableBenefit: "Sachbezug (monatlich)",
        companyCar: "Sachbezug durch Firmen-PKW (monatlich)",
        allowance: "Steuerlicher Freibetrag (monatlich)",
        commuterAllowance: "Pendlerpauschale (monatlich)",
      },
    },
    faq: {
      badge: "FAQ",
      title: "Häufig gestellte Fragen",
      description:
        "Antworten zu häufigen Fragen rund um dein österreichisches Nettoeinkommen sowie Steuern und Abgaben.",
      notesTitle: "Hinweise",
      notes: [
        "Die Regeln ändern sich immer wieder. Maßgeblich sind die jeweils geltenden Gesetze und offiziellen Informationen (Finanzamt, Sozialversicherung).",
        "Dieses FAQ ist vereinfachend und ersetzt keine Rechtsberatung.",
      ],
    },
    footer: {
      text: "Created by",
      highlight: "Aestero Studios",
      suffix: "in Austria.",
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
