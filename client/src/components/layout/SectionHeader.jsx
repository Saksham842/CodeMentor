import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({ chapter, title, className }) {
  return (
    <div className={cn("mb-8 w-full", className)}>
      <span className="block text-[10px] font-display font-bold uppercase tracking-[0.3em] text-comet mb-1">
        {chapter}
      </span>
      <h1 className="text-3xl font-display font-bold text-white tracking-wide">
        {title}
      </h1>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-nebula/40 to-transparent" />
    </div>
  );
}

export default SectionHeader;
