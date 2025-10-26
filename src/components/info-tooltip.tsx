"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";

interface InfoTooltipProps {
  content: string;
  accent?: boolean;
  label: string;
}

export function InfoTooltip({ content, accent = false, label }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const show = () => setIsOpen(true);
  const hide = () => setIsOpen(false);
  const toggle = () => setIsOpen((previous) => !previous);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        aria-label={`More information about ${label}`}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-haspopup="dialog"
        className={clsx(
          "flex h-7 w-7 items-center justify-center rounded-full border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
          accent
            ? "border-white/30 bg-white/15 text-white/90 hover:bg-white/25 focus-visible:ring-white/70"
            : "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 focus-visible:ring-rose-300/80",
        )}
        onClick={(event) => {
          event.preventDefault();
          toggle();
        }}
        onFocus={show}
        onBlur={hide}
      >
        <InformationCircleIcon className="h-4 w-4" aria-hidden />
      </button>
      <div
        role="tooltip"
        id={tooltipId}
        className={clsx(
          "absolute right-0 top-9 z-30 w-60 rounded-2xl border p-4 text-[0.75rem] leading-relaxed shadow-xl backdrop-blur transition-all duration-150",
          accent
            ? "border-white/20 bg-slate-900/95 text-rose-100"
            : "border-rose-100/80 bg-white/95 text-slate-600",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {content}
      </div>
    </div>
  );
}
