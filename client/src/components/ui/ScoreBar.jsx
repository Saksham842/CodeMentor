import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreBar({ value, label, colorClass = "bg-nebula", className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-display font-semibold uppercase tracking-wider text-stardust">
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-white">
          {value}%
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-rift overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>
  );
}
