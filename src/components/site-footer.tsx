"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { dictionary } = useLanguage();
  const footer = dictionary.footer;

  return (
    <footer className="mt-24 border-t border-rose-100/70 bg-white/60 py-10 backdrop-blur print:hidden">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-6 text-center">
        <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600">
          <span>
            {footer.text} {" "}
            <span className="font-semibold text-rose-600">{footer.highlight}</span> {footer.suffix}
          </span>
          <span aria-hidden="true" className="text-rose-200">
            •
          </span>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1 rounded-full bg-rose-50/80 px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-transparent transition hover:bg-rose-100/80 hover:text-rose-700 hover:shadow-md hover:ring-rose-200"
          >
            {footer.privacyLinkLabel}
          </Link>
          <span aria-hidden="true" className="text-rose-200">
            •
          </span>
          <Link
            href="/changelog"
            className="inline-flex items-center gap-1 rounded-full bg-rose-50/80 px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-transparent transition hover:bg-rose-100/80 hover:text-rose-700 hover:shadow-md hover:ring-rose-200"
          >
            {footer.changelogLinkLabel}
          </Link>
          <span aria-hidden="true" className="text-rose-200">
            •
          </span>
          <a
            href="mailto:aesterostudios@icloud.com"
            className="inline-flex items-center gap-1 rounded-full bg-rose-50/80 px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-transparent transition hover:bg-rose-100/80 hover:text-rose-700 hover:shadow-md hover:ring-rose-200"
          >
            {footer.contactLinkLabel}
          </a>
        </p>
      </div>
    </footer>
  );
}
