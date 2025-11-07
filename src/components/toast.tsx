"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  show: boolean;
  duration?: number;
  onHide?: () => void;
}

export function Toast({ message, show, duration = 2000, onHide }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onHide) {
          setTimeout(onHide, 300); // Wait for exit animation
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onHide]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border-2 border-green-200 bg-green-50 px-4 py-3 shadow-xl">
        <CheckIcon className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-green-800">
          {message}
        </span>
      </div>
    </div>
  );
}
