"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { headerPrimaryLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export default function PrivacyPage() {
  const { dictionary } = useLanguage();
  const { privacy, common } = dictionary;

  return (
    <main className="relative mx-auto min-h-screen w-full px-4 pb-20 pt-6 sm:px-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-rose-100/50 bg-white/80 backdrop-blur-xl print:hidden sm:-mx-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className={`inline-flex items-center gap-2 ${headerPrimaryLinkClasses} text-sm`}>
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{privacy.backLink}</span>
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
        {/* Header Section */}
        <div className="overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-8 sm:px-8 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                {privacy.badge}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {privacy.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {privacy.intro}
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="grid gap-6 sm:grid-cols-2">
          {privacy.sections.map((section) => (
            <div
              key={section.title}
              className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-rose-100/60 bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="border-b border-rose-100/60 bg-gradient-to-r from-rose-50/50 to-pink-50/50 px-6 py-4 sm:px-8">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{section.title}</h2>
              </div>
              <div className="space-y-3 px-6 pb-6 text-sm leading-relaxed text-slate-600 sm:px-8">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
