"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { headerPrimaryLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export default function ChangelogPage() {
  const { dictionary } = useLanguage();
  const { changelog, common } = dictionary;
  const isGerman = common.nav.calculator === "Rechner";

  return (
    <main className="relative mx-auto min-h-screen w-full px-4 pb-20 pt-6 sm:px-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-rose-100/50 bg-white/80 backdrop-blur-xl print:hidden sm:-mx-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className={`inline-flex items-center gap-2 ${headerPrimaryLinkClasses} text-sm`}>
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{changelog.backLink}</span>
              <span className="sm:hidden">{isGerman ? "Zurück" : "Back"}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-8 sm:px-8 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 mb-4">
              <SparklesIcon className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                {changelog.badge}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {changelog.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {changelog.description}
            </p>
          </div>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {/* Version 1.1.0 - November 22, 2025 */}
          <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
            <div className="border-b border-rose-100/60 bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {isGerman ? "Version 1.1.0" : "Version 1.1.0"}
                </h2>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {isGerman ? "22. November 2025" : "November 22, 2025"}
                </span>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {/* Fixed Bugs Section */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  {isGerman ? "Behobene Berechnungsfehler" : "Fixed Calculation Errors"}
                </h3>
                <div className="space-y-4">
                  {/* Social Insurance Fixes */}
                  <div className="rounded-2xl border border-green-100 bg-green-50/30 p-4">
                    <h4 className="mb-2 font-semibold text-slate-900">
                      {isGerman ? "Sozialversicherung (SV)" : "Social Insurance (SV)"}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                          {isGerman
                            ? <><strong>SV-Freibetrag für Sonderzahlungen:</strong> Erste €560,65 der 13./14. Gehälter sind jetzt SV-frei (wurde vorher nicht berücksichtigt)</>
                            : <><strong>SV exemption for special payments:</strong> First €560.65 of 13th/14th salaries are now SV-exempt (was not considered before)</>
                          }
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                          {isGerman
                            ? <><strong>Sachbezug (Firmenauto) 20%-Regelung:</strong> Nur noch 20% des Sachbezugs zählen für SV-Berechnung statt 100% (§49 Abs 3 Z 11 ASVG)</>
                            : <><strong>Company car 20% rule:</strong> Only 20% of company car benefits count for SV calculation instead of 100% (§49 Abs 3 Z 11 ASVG)</>
                          }
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                          {isGerman
                            ? <><strong>Geringfügigkeitsgrenze:</strong> Unter €518,44 monatlich wird keine SV mehr berechnet</>
                            : <><strong>Minor employment threshold:</strong> Below €518.44 monthly, no SV is calculated</>
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Tax Credits Fixes */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4">
                    <h4 className="mb-2 font-semibold text-slate-900">
                      {isGerman ? "Steuerabsetzbeträge" : "Tax Credits"}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>
                          {isGerman
                            ? <><strong>Pendlereuro hinzugefügt:</strong> €6 pro Kilometer für 2026 (verdreifacht von €2!) - fehlte komplett</>
                            : <><strong>Commuter euro added:</strong> €6 per kilometer for 2026 (tripled from €2!) - was completely missing</>
                          }
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>
                          {isGerman
                            ? <><strong>Verkehrsabsetzbetrag-Grenzen korrigiert:</strong> Alle Einkommensgrenzen korrekt mit 1,75% indexiert</>
                            : <><strong>Commuter deduction limits corrected:</strong> All income limits correctly indexed by 1.75%</>
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* New Features Section */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <SparklesIcon className="h-5 w-5 text-rose-600" />
                  {isGerman ? "Neue Features" : "New Features"}
                </h3>
                <div className="space-y-2">
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="text-rose-600">•</span>
                        <span>
                          {isGerman
                            ? <><strong>Optionales Feld "commuterDistanceKm":</strong> Für genaue Pendlereuro-Berechnung (einfache Entfernung in km)</>
                            : <><strong>Optional "commuterDistanceKm" field:</strong> For accurate commuter euro calculation (one-way distance in km)</>
                          }
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-rose-600">•</span>
                        <span>
                          {isGerman
                            ? <><strong>User-Test-Cases:</strong> Validierung mit echten User-Beispielen</>
                            : <><strong>User test cases:</strong> Validation with real user examples</>
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Updated Values Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  {isGerman ? "Aktualisierte 2026-Werte" : "Updated 2026 Values"}
                </h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          {isGerman ? "Konstante" : "Constant"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                          {isGerman ? "Wert" : "Value"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-sm">
                      <tr>
                        <td className="px-4 py-3 text-slate-900">Verkehrsabsetzbetrag</td>
                        <td className="px-4 py-3 font-mono text-slate-700">€496</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900">
                          {isGerman ? "Erhöhter Verkehrsabsetzbetrag" : "Increased commuter deduction"}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          €853 {isGerman ? "bis" : "up to"} €15.071
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900">Zuschlag</td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          €804 (€19.764 - €30.264)
                        </td>
                      </tr>
                      <tr className="bg-rose-50/30">
                        <td className="px-4 py-3 font-semibold text-slate-900">Pendlereuro</td>
                        <td className="px-4 py-3 font-mono font-semibold text-rose-700">
                          €6 / km
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900">
                          {isGerman ? "SV-Freibetrag Sonderzahlungen" : "SV exemption special payments"}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">€560,65</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900">
                          {isGerman ? "Geringfügigkeitsgrenze" : "Minor employment threshold"}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">€518,44</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accuracy Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  {isGerman ? "Genauigkeit" : "Accuracy"}
                </h3>
                <div className="rounded-2xl border border-green-100 bg-green-50/30 p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    {isGerman ? "Test mit 5400€ Brutto:" : "Test with €5,400 gross:"}
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>
                      {isGerman ? "Berechnet:" : "Calculated:"} <span className="font-mono font-semibold">€3,408.60</span> {isGerman ? "netto" : "net"}
                    </li>
                    <li>
                      {isGerman ? "Erwartet:" : "Expected:"} <span className="font-mono">€3,400.09</span> {isGerman ? "netto" : "net"}
                    </li>
                    <li className="font-semibold text-green-700">
                      {isGerman ? "Differenz:" : "Difference:"} <span className="font-mono">€8.51 (0.25%)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
