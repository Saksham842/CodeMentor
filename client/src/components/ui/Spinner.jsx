import * as React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md", ...props }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-nebula",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
