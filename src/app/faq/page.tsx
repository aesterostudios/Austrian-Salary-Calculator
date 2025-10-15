import Link from "next/link";
import { headerLinkClasses } from "@/components/header-link";

export default function FAQPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 px-6 pb-16 pt-28 text-center">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link href="/" className={headerLinkClasses}>
          Rechner
        </Link>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-400">
          FAQ
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Häufig gestellte Fragen
        </h1>
        <p className="text-sm text-slate-500">
          Hier beantworten wir demnächst die wichtigsten Fragen rund um den Brutto-Netto-Rechner.
        </p>
      </div>
    </main>
  );
}
