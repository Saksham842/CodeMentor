import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layers, ArrowUpDown } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import ComplexityRings from "@/components/charts/ComplexityRings";
import { BarChart } from "@/components/charts/BarChart";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useProject } from "@/hooks/useProject";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS = {
  high: "border-nova-500/30 bg-nova-500/5 text-nova-300",
  medium: "border-solar-500/30 bg-solar-500/5 text-solar-300",
  low: "border-aurora-500/20 bg-aurora-500/5 text-aurora-300",
};

export default function ComplexityPage() {
  const { project } = useProject();
  const [sortKey, setSortKey] = useState("complexity");
  const [sortDir, setSortDir] = useState("desc");

  const complexFunctions = project?.complexFunctions || [];
  const MAINTAINABILITY_ISSUES = [];

  const sortedFunctions = useMemo(() => {
    return [...complexFunctions].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [sortKey, sortDir, complexFunctions]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const getComplexityBadge = (complexity) => {
    if (complexity >= 20) return "supernova";
    if (complexity >= 10) return "solar";
    if (complexity >= 5) return "aurora";
    return "nebula";
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XVIII"
        title="The Weight of Code"
        subtitle="Complexity is the enemy of clarity. These metrics reveal where the codebase grows heavy — and where refactoring must strike."
        icon={<Layers className="w-6 h-6 text-solar-400" />}
      />

      <div className="mb-8">
        <ComplexityRings />
      </div>

      <Card glow className="p-6 mb-8">
        <h3 className="text-base font-display font-semibold text-stardust-100 mb-4">
          Complexity by Folder
        </h3>
        <BarChart />
      </Card>

      <div className="mb-8">
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-4">
          Most Complex Functions
        </h3>
        <Card glow className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-vault-600/30 bg-void-950/40">
                {[
                  { key: "name", label: "Function" },
                  { key: "file", label: "File" },
                  { key: "complexity", label: "Complexity" },
                  { key: "lines", label: "Lines" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-5 py-3 text-xs text-stardust-400 uppercase tracking-wider cursor-pointer hover:text-stardust-200 transition-colors select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown
                        className={cn(
                          "w-3 h-3",
                          sortKey === col.key ? "text-nebula-400" : "text-stardust-600"
                        )}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedFunctions.map((fn, i) => (
                <motion.tr
                  key={fn.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-vault-600/20 hover:bg-vault-700/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <code className="text-sm text-stardust-100 font-mono">{fn.name}()</code>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-stardust-400 font-mono">{fn.file}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={getComplexityBadge(fn.complexity)}>{fn.complexity}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-stardust-300 font-mono">{fn.lines}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-4">
          Maintainability Issues
        </h3>
        <StaggerReveal className="space-y-3">
          {MAINTAINABILITY_ISSUES.map((issue, i) => (
            <Card
              key={i}
              glow
              className={cn(
                "p-4 border",
                SEVERITY_COLORS[issue.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 w-2 h-2 rounded-full shrink-0",
                    issue.severity === "high" ? "bg-nova-400" : "bg-solar-400"
                  )}
                />
                <div>
                  <h4 className="text-sm font-medium text-stardust-100 mb-1">{issue.title}</h4>
                  <p className="text-sm text-stardust-400">{issue.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </StaggerReveal>
      </div>
    </PageWrapper>
  );
}
