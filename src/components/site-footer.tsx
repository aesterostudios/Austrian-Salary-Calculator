"use client";

import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { dictionary } = useLanguage();
  const footer = dictionary.footer;

  return (
    <footer className="mt-24 border-t border-rose-100/70 bg-white/60 py-10 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-6 text-center">
        <p className="text-sm font-medium text-slate-600">
          {footer.text} <span className="font-semibold text-rose-600">{footer.highlight}</span> {footer.suffix}
        </p>
      </div>
    </footer>
  );
}
