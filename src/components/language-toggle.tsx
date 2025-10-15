"use client";

import { useState } from "react";
import clsx from "clsx";

type Language = "de" | "en";

const options: { id: Language; label: string }[] = [
  { id: "de", label: "Deutsch" },
  { id: "en", label: "English" },
];

export function LanguageToggle() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1 text-sm font-semibold text-rose-600 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur">
      {options.map((option) => {
        const isActive = selectedLanguage === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelectedLanguage(option.id)}
            className={clsx(
              "rounded-full px-3 py-1 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200",
              isActive
                ? "bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]"
                : "text-rose-600/80 hover:text-rose-700",
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
