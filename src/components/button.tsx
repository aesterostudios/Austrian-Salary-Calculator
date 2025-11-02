import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 hover:shadow-xl hover:shadow-rose-500/30",
        secondary: "border-2 border-rose-200 bg-white text-rose-700 shadow-md hover:border-rose-300 hover:bg-rose-50 hover:shadow-lg",
        ghost: "text-slate-700 hover:bg-rose-50 hover:text-rose-700",
        toggle: "text-slate-700 hover:bg-white hover:text-rose-700",
        toggleActive: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25",
      },
      size: {
        sm: "rounded-xl px-3 py-2 text-sm min-h-[36px]",
        md: "rounded-xl px-4 py-3 text-sm min-h-[44px]",
        lg: "rounded-2xl px-8 py-4 text-lg min-h-[56px]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{children}</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
