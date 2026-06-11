import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function IntensityMeter({ level, onChange, className }) {
  const steps = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={cn("p-4 rounded-xl border bg-cavern/80 select-none", level === 10 ? "border-supernova animate-pulse-glow" : "border-rift", className)}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-display font-bold uppercase tracking-wider text-white">
          ⚔️ ADVERSARIAL STRESS INTENSITY
        </span>
        <span className={cn("font-mono font-bold text-xs px-2.5 py-0.5 rounded", level === 10 ? "bg-supernova text-white" : "bg-rift text-comet")}>
          LEVEL {level}/10
        </span>
      </div>

      <div className="flex items-center gap-1.5 w-full">
        {steps.map((s) => {
          const isActive = s <= level;
          const isMax = s === 10;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={cn(
                "flex-1 h-3 rounded-sm transition-all focus:outline-none cursor-pointer",
                isActive
                  ? isMax
                    ? "bg-supernova shadow-[0_0_10px_#ef4444]"
                    : s > 7
                    ? "bg-solar"
                    : "bg-gradient-to-r from-nebula to-aurora"
                  : "bg-rift hover:bg-rift/70"
              )}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-2.5 text-[9px] font-semibold text-stardust/40 uppercase tracking-widest">
        <span>Constructive</span>
        <span>Demanding</span>
        <span className={cn(level === 10 ? "text-supernova font-bold" : "")}>Ruthless</span>
      </div>
    </div>
  );
}

export default IntensityMeter;
