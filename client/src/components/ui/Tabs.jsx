import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("flex space-x-1 border-b border-rift pb-px", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2.5 text-xs font-display font-bold uppercase tracking-widest transition-colors focus:outline-none",
              isActive ? "text-white" : "text-comet hover:text-white"
            )}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nebula to-aurora"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
