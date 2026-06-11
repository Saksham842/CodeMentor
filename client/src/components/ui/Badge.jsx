import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "comet", children, ...props }) {
  const styles = {
    nebula: "bg-nebula/10 text-comet border border-nebula/30",
    aurora: "bg-aurora/10 text-stardust border border-aurora/30",
    nova: "bg-nova/10 text-nova border border-nova/30",
    solar: "bg-solar/10 text-solar border border-solar/30",
    supernova: "bg-supernova/10 text-supernova border border-supernova/30",
    cosmic: "bg-cosmic/10 text-cosmic border border-cosmic/30",
    comet: "bg-rift/50 text-stardust border border-rift"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
