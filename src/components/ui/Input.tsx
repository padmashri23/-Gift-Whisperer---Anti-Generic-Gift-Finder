"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
