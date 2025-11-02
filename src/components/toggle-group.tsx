"use client";

import { type ReactNode } from "react";
import clsx from "clsx";

interface ToggleOption<T extends string> {
  id: T;
  label: ReactNode;
  description?: string;
  ariaLabel?: string;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  fullWidth = true,
  size = "md",
}: ToggleGroupProps<T>) {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-3.5 text-base",
  };

  const minHeightClasses = {
    sm: "min-h-[36px]",
    md: "min-h-[44px]",
    lg: "min-h-[52px]",
  };

  return (
    <div className={clsx("flex gap-2", fullWidth && "w-full")}>
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={clsx(
              "flex-1 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300",
              sizeClasses[size],
              minHeightClasses[size],
              isActive
                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
            )}
            aria-pressed={isActive}
            aria-label={option.ariaLabel}
          >
            {option.description ? (
              <div className="flex flex-col items-center gap-0.5">
                <span className={clsx("text-xs opacity-75", isActive && "text-white")}>
                  {option.description}
                </span>
                <span>{option.label}</span>
              </div>
            ) : (
              option.label
            )}
          </button>
        );
      })}
    </div>
  );
}
