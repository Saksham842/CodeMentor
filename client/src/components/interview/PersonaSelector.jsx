import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import { Users, ShieldAlert, Award, Coffee } from "lucide-react";

export const PERSONAS = [
  {
    id: "cto",
    name: "Harlan Vance",
    role: "The Brutal CTO",
    description: "Deeply skeptical of design choices. Will probe security holes, Stripe configurations, and single points of failure.",
    icon: ShieldAlert,
    avatarText: "HV"
  },
  {
    id: "architect",
    name: "Elena Rostova",
    role: "The Cynical Architect",
    description: "Obsessed with design patterns, clean abstractions, and scalability. Heavily critiques Prisma query strategies.",
    icon: Award,
    avatarText: "ER"
  },
  {
    id: "lead",
    name: "Marcus Brody",
    role: "The Pragmatic Lead",
    description: "Values code legibility, test coverage, and deployment simplicity. Investigates test setups and Docker builds.",
    icon: Coffee,
    avatarText: "MB"
  },
  {
    id: "recruiter",
    name: "Tiffany Chen",
    role: "The Fast Recruiter",
    description: "Tracks quick summaries, high-level impact statements, core tech stack terms, and onboarding velocity.",
    icon: Users,
    avatarText: "TC"
  }
];

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  selectedCategories,
  onToggleCategory
}) {
  const categories = ["Security", "Database", "Caching", "DevOps", "Payments", "Next.js Routing"];

  return (
    <div className="space-y-6 select-none">
      <div>
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-3">
          👥 Choose Your Interviewer
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {PERSONAS.map((p) => {
            const isSelected = p.id === selectedPersona;
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={cn(
                  "p-4 flex gap-4 items-start cursor-pointer hover:border-nebula/40 transition-all text-left",
                  isSelected ? "border-nebula bg-nebula/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white shadow-md shrink-0",
                  isSelected ? "bg-gradient-to-tr from-nebula to-aurora" : "bg-rift/50 border border-rift"
                )}>
                  {p.avatarText}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                     <h4 className="text-xs font-bold text-white leading-none">{p.name}</h4>
                    <span className="text-[10px] text-comet font-medium">({p.role})</span>
                  </div>
                  <p className="text-[11px] text-stardust/80 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-3">
          🎯 Trial Core Targets
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-mono text-stardust hover:text-white cursor-pointer select-none hover:border-nebula/30 transition-all",
                  checked ? "bg-cavern border-nebula text-white" : "border-rift bg-void/20"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleCategory(cat)}
                  className="hidden"
                />
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  checked ? "border-nebula bg-nebula" : "border-rift bg-transparent"
                )}>
                  {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PersonaSelector;
