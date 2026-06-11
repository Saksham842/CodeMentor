import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Loader2, Code } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { showToast } from "@/components/ui/Toast";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG = {
  HIGH: { badge: "supernova", color: "border-nova-500/30 bg-nova-500/5" },
  MEDIUM: { badge: "solar", color: "border-solar-500/30 bg-solar-500/5" },
  INFO: { badge: "nebula", color: "border-nebula-500/20 bg-nebula-500/5" },
};

export default function SecurityPage() {
  const { project } = useProject();
  const [fixSlideOver, setFixSlideOver] = useState(null);
  const [loadingFix, setLoadingFix] = useState(null);

  const issues = project?.securityIssues || [];
  const handleGenerateFix = async (issue, idx) => {
    setLoadingFix(idx);
    try {
      const res = await fetch("/api/grok/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue, projectContext: buildContextString(project) }),
      });
      const data = await res.json();
      setFixSlideOver({
        title: `Fix: ${issue.title}`,
        before: issue.codeSnippet ?? "// Original vulnerable code",
        after: data.fix ?? "// Grok-generated secure code",
        language: "typescript",
      });
    } catch {
      showToast.error("Could not generate fix.");
    } finally {
      setLoadingFix(null);
    }
  };

  const highCount = issues.filter((i) => i.severity === "HIGH").length;
  const medCount = issues.filter((i) => i.severity === "MEDIUM").length;

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XVII"
        title="Breach Point Analysis"
        subtitle="Every fortress has cracks. These are the vulnerabilities lurking in your codebase — seal them before the enemy finds them."
        icon={<ShieldAlert className="w-6 h-6 text-nova-400" />}
      />

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <Card glow className="p-6 flex items-center gap-8 flex-1">
          <div className="flex flex-col items-center">
            <ProgressRing score={project?.scores?.security ?? 71} size={120} strokeWidth={10} />
            <p className="text-sm text-stardust-400 mt-3">Security Score</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stardust-300">Critical / High</span>
              <Badge variant="supernova">{highCount} issues</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stardust-300">Medium</span>
              <Badge variant="solar">{medCount} issues</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stardust-300">Info / Low</span>
              <Badge variant="nebula">
                {issues.length - highCount - medCount} issues
              </Badge>
            </div>
          </div>
        </Card>

        <Card glow className="p-6 flex-1">
          <h4 className="text-base font-display font-semibold text-stardust-100 mb-4">
            OWASP Top 10 Coverage
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "A01 Broken Access Control", status: "warn" },
              { name: "A02 Cryptographic Failures", status: "ok" },
              { name: "A03 Injection", status: "warn" },
              { name: "A04 Insecure Design", status: "ok" },
              { name: "A05 Security Misconfiguration", status: "warn" },
              { name: "A06 Vulnerable Components", status: "ok" },
              { name: "A07 Auth Failures", status: "ok" },
              { name: "A08 Data Integrity Failures", status: "ok" },
              { name: "A09 Logging Failures", status: "warn" },
              { name: "A10 SSRF", status: "ok" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    item.status === "ok" ? "bg-aurora-400" : "bg-nova-400"
                  )}
                />
                <span className="text-xs text-stardust-400 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <StaggerReveal className="space-y-4">
        {issues.map((issue, idx) => {
          const cfg = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.INFO;
          return (
            <motion.div key={idx}>
              <Card glow className={cn("p-5 border", cfg.color)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={cfg.badge}>{issue.severity}</Badge>
                      <span className="text-xs font-mono text-stardust-400">{issue.file}</span>
                    </div>
                    <h4 className="text-base font-medium text-stardust-100 mb-1">
                      {issue.title}
                    </h4>
                    <p className="text-sm text-stardust-400 mb-3">{issue.description}</p>
                    {issue.codeSnippet && (
                      <div className="rounded-lg overflow-hidden">
                        <CodeBlock
                          code={issue.codeSnippet}
                          language="typescript"
                          maxHeight={120}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={loadingFix === idx}
                    onClick={() => handleGenerateFix(issue, idx)}
                    icon={
                      loadingFix === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Code className="w-4 h-4" />
                      )
                    }
                    className="shrink-0"
                  >
                    {loadingFix === idx ? "Generating..." : "Generate Fix"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </StaggerReveal>

      <SlideOver
        open={!!fixSlideOver}
        onClose={() => setFixSlideOver(null)}
        title={fixSlideOver?.title ?? "Security Fix"}
        width="lg"
      >
        {fixSlideOver && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-nova-400 font-mono mb-2">⚠ Before (Vulnerable)</p>
              <CodeBlock code={fixSlideOver.before} language={fixSlideOver.language} />
            </div>
            <div>
              <p className="text-sm text-aurora-400 font-mono mb-2">✓ After (Secure)</p>
              <CodeBlock code={fixSlideOver.after} language={fixSlideOver.language} />
            </div>
          </div>
        )}
      </SlideOver>
    </PageWrapper>
  );
}
