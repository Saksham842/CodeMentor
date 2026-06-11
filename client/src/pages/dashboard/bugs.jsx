import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug as BugIcon, Loader2, Code2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { showToast } from "@/components/ui/Toast";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  logic: { badge: "supernova", label: "Logic Bug" },
  performance: { badge: "solar", label: "Performance" },
  "dead-code": { badge: "comet", label: "Dead Code" },
};

const TABS = [
  { id: "all", label: "All" },
  { id: "logic", label: "Logic Bugs" },
  { id: "performance", label: "Performance" },
  { id: "dead-code", label: "Dead Code" },
];

export default function BugsPage() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState("all");
  const [loadingFix, setLoadingFix] = useState(null);
  const [fixSlideOver, setFixSlideOver] = useState(null);

  const bugs = project?.bugs || [];
  const filteredBugs =
    activeTab === "all"
      ? bugs
      : bugs.filter((b) => b.type === activeTab);

  const handleGenerateFix = async (bug, idx) => {
    setLoadingFix(idx);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bug_fix",
          bug: {
            title: bug.title,
            description: bug.description,
            code: bug.codeSnippet,
          },
          projectContext: buildContextString(project),
        }),
      });
      const data = await res.json();
      setFixSlideOver({
        title: `Fix: ${bug.title}`,
        before: bug.codeSnippet ?? "// Original code",
        after: data.fix ?? data.result ?? "// Grok-generated fix",
        explanation: data.explanation ?? "Grok suggests the above correction.",
      });
    } catch {
      showToast.error("Could not generate fix.");
    } finally {
      setLoadingFix(null);
    }
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XIX"
        title="Shadows in the Code"
        subtitle="Hidden bugs are a hero's greatest nemesis. Expose them, understand them, and eliminate them from the realm."
        icon={<BugIcon className="w-6 h-6 text-nova-400" />}
      />

      <div className="mb-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {filteredBugs.length === 0 ? (
            <Card glow className="p-12 flex items-center justify-center">
              <p className="text-stardust-500">No bugs in this category. The realm is clear.</p>
            </Card>
          ) : (
            <StaggerReveal className="space-y-6">
              {filteredBugs.map((bug, idx) => {
                const cfg = TYPE_CONFIG[bug.type] ?? { badge: "comet", label: bug.type };
                return (
                  <Card key={idx} elevated glow className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={cfg.badge}>{cfg.label}</Badge>
                          <span className="text-xs font-mono text-stardust-400">{bug.file}</span>
                          {bug.line && (
                            <span className="text-xs font-mono text-stardust-500">
                              Line {bug.line}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-semibold text-stardust-100 mb-1">
                          {bug.title}
                        </h4>
                        <p className="text-sm text-stardust-400">{bug.description}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={loadingFix === idx}
                        onClick={() => handleGenerateFix(bug, idx)}
                        icon={
                          loadingFix === idx ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Code2 className="w-4 h-4" />
                          )
                        }
                        className="shrink-0"
                      >
                        {loadingFix === idx ? "Fixing..." : "Generate Fix"}
                      </Button>
                    </div>
                    {bug.codeSnippet && (
                      <CodeBlock code={bug.codeSnippet} language="typescript" />
                    )}
                    {bug.impact && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-stardust-500">Impact:</span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            bug.impact === "high"
                              ? "text-nova-400"
                              : bug.impact === "medium"
                              ? "text-solar-400"
                              : "text-aurora-400"
                          )}
                        >
                          {bug.impact.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </StaggerReveal>
          )}
        </motion.div>
      </AnimatePresence>

      <SlideOver
        open={!!fixSlideOver}
        onClose={() => setFixSlideOver(null)}
        title={fixSlideOver?.title ?? "Bug Fix"}
        width="lg"
      >
        {fixSlideOver && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-nova-400 font-mono mb-2">⚠ Before (Buggy)</p>
              <CodeBlock code={fixSlideOver.before} language="typescript" />
            </div>
            <div>
              <p className="text-sm text-aurora-400 font-mono mb-2">✓ After (Fixed)</p>
              <CodeBlock code={fixSlideOver.after} language="typescript" />
            </div>
            <Card className="p-4 border-nebula-500/20 bg-nebula-500/5">
              <p className="text-xs text-nebula-400 mb-1 font-mono">✦ Explanation</p>
              <p className="text-sm text-stardust-200">{fixSlideOver.explanation}</p>
            </Card>
          </div>
        )}
      </SlideOver>
    </PageWrapper>
  );
}
