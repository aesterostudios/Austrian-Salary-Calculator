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
      {/* Collapsed State - Always visible in layout */}
      <div
        className={clsx(
          "inline-flex items-center rounded-full border border-white/60 bg-white/40 shadow-[0_12px_30px_rgba(244,114,182,0.15)] backdrop-blur transition-all duration-300 ease-in-out hover:shadow-[0_12px_30px_rgba(244,114,182,0.25)] gap-2 p-2 hover:bg-white/60",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 text-rose-600 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
          aria-label="Change language"
          tabIndex={isOpen ? -1 : 0}
        >
          <LanguageIcon className="h-5 w-5 transition-transform duration-300" />
        </button>
      </div>

      {/* Expanded State - Absolute positioned overlay */}
      {isOpen && (
        <div
          className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1 shadow-[0_12px_30px_rgba(244,114,182,0.25)] backdrop-blur animate-in fade-in zoom-in-95 duration-200"
        >
          {options.map((option, index) => {
            const isActive = language === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleLanguageChange(option.id)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 animate-in fade-in slide-in-from-top-2 cursor-pointer",
                  isActive
                    ? "bg-rose-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.35)]"
                    : "text-rose-700 hover:text-rose-800",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
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
