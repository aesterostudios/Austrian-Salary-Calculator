"use client";

import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage, dictionary } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { id: Language; label: string }[] = [
    { id: "de", label: dictionary.common.languageNames.de },
    { id: "en", label: dictionary.common.languageNames.en },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 p-2 text-rose-600 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur transition-all hover:bg-white/60 hover:shadow-[0_12px_30px_rgba(244,114,182,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
          aria-label="Change language"
        >
          <LanguageIcon className="h-5 w-5" />
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1 text-sm font-semibold text-rose-600 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur">
          {options.map((option) => {
            const isActive = language === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleLanguageChange(option.id)}
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
      )}
    </div>
  );
}
