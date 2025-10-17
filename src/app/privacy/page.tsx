"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { headerLinkClasses } from "@/components/header-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export default function PrivacyPage() {
  const { dictionary } = useLanguage();
  const { privacy } = dictionary;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 pb-16 pt-28">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link href="/" className={headerLinkClasses}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span>{privacy.backLink}</span>
        </Link>
        <LanguageToggle />
      </div>

      <section className="space-y-6 rounded-3xl bg-white/80 p-10 text-left shadow-[0_20px_60px_rgba(244,114,182,0.15)] ring-1 ring-white/60 backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          {privacy.badge}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {privacy.title}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
          {privacy.intro}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {privacy.sections.map((section) => (
          <article
            key={section.title}
            className="flex h-full flex-col gap-4 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(244,114,182,0.18)]"
          >
            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

    </main>
  );
}
