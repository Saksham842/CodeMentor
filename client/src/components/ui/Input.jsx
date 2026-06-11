import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1.5 text-xs font-display font-semibold uppercase tracking-wider text-comet">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-lg border border-rift bg-void/50 px-4 py-2.5 text-sm text-white placeholder-stardust/40 transition-all focus:border-nebula focus:outline-none focus:ring-1 focus:ring-nebula focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-supernova focus:border-supernova focus:ring-supernova",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="mt-1 block text-xs font-medium text-supernova">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
