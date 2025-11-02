"use client";

import { useLanguage } from "@/components/language-provider";

interface YesNoToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoToggle({ value, onChange, yesLabel, noLabel }: YesNoToggleProps) {
  const { dictionary } = useLanguage();
  const { common } = dictionary;

  const finalYesLabel = yesLabel ?? common.responses.yes;
  const finalNoLabel = noLabel ?? common.responses.no;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          value
            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20"
            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
        }`}
        aria-pressed={value}
      >
        {finalYesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          !value
            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20"
            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
        }`}
        aria-pressed={!value}
      >
        {finalNoLabel}
      </button>
    </div>
  );
}
