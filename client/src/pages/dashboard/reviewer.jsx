import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Loader2, Download, Copy, Star } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const VERDICT_SECTIONS = [
  {
    title: "Strengths",
    icon: "⚔️",
    color: "aurora",
    borderClass: "border-aurora-500/30 bg-aurora-500/5",
    titleClass: "text-aurora-300",
    items: [
      "Excellent TypeScript discipline — strict mode with zero any casts across 47 files",
      "React performance patterns: memo, useCallback, and lazy loading used correctly",
      "Clean separation of concerns: API layer, data access layer, and UI cleanly isolated",
      "Stripe integration is production-hardened with idempotency keys and webhook validation",
      "Test coverage on critical paths (checkout, auth) — uncommon in junior/mid codebases",
    ],
  },
  {
    title: "Weaknesses",
    icon: "🛡️",
    color: "nova",
    borderClass: "border-nova-500/30 bg-nova-500/5",
    titleClass: "text-nova-300",
    items: [
      "N+1 query problem in vendor dashboard — up to 50 sequential DB queries on load",
      "Missing rate limiting on auth endpoints — brute force vulnerability",
      "processOrder() is a 247-line god function violating SRP",
      "No E2E test coverage for checkout flow — highest risk area is untested",
      "Redis cache TTLs are inconsistent — some data stales too quickly, some too slowly",
    ],
  },
  {
    title: "Scalability Assessment",
    icon: "🌌",
    color: "nebula",
    borderClass: "border-nebula-500/30 bg-nebula-500/5",
    titleClass: "text-nebula-300",
    items: [
      "Current architecture handles ~50K daily transactions comfortably",
      "Database connection pool (100 connections) will bottleneck at ~500 concurrent users",
      "Product search on PostgreSQL ILIKE will fail beyond 100K products — needs Elasticsearch",
      "Image upload to local filesystem is not horizontally scalable — migrate to S3",
      "Session storage in JWT is fine for now but will require Redis at 10K+ concurrent users",
    ],
  },
  {
    title: "To Reach 95/100",
    icon: "🏆",
    color: "solar",
    borderClass: "border-solar-500/30 bg-solar-500/5",
    titleClass: "text-solar-300",
    items: [
      "Fix the N+1 queries with Prisma eager loading (2h effort, massive impact)",
      "Extract processOrder() into 4 focused services (4h, high maintainability gain)",
      "Add rate limiting to all public endpoints via Upstash Ratelimit (1h)",
      "Migrate image storage to S3/Cloudflare R2 (4h, production necessity)",
      "Add Playwright E2E suite for checkout and auth flows (8h, peace of mind)",
    ],
  },
];

export default function ReviewerPage() {
  const { project } = useProject();
  const [verdict, setVerdict] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateVerdict = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/grok/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: project?.name || "NexaCommerce", score: project?.scores?.readiness || 84, projectContext: buildContextString(project) }),
      });
      const data = await res.json();
      setVerdict(data.verdict ?? data.result ?? "");
    } catch {
      showToast.error("The verdict could not be rendered.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyVerdict = () => {
    if (!verdict) return;
    navigator.clipboard.writeText(verdict);
    showToast.success("Verdict copied to clipboard!");
  };

  const handleExportVerdict = () => {
    if (!verdict) return;
    const blob = new Blob([verdict], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.name || 'project'}-verdict.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("Verdict exported!");
  };

  return (
    <PageWrapper>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.2) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      <SectionHeader
        chapter="Chapter XX — Climax"
        title="The Final Verdict"
        subtitle="The council has deliberated. The scrolls have been read. Your codebase stands before judgment."
        icon={<Crown className="w-6 h-6 text-solar-400" />}
      />

      <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 rounded-full blur-3xl bg-solar-500/10 scale-125" />
          <ProgressRing score={project?.scores?.readiness || 84} size={180} strokeWidth={14} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-2"
          >
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-solar-400 fill-solar-400" />
            ))}
            <Star className="w-5 h-5 text-stardust-600" />
          </motion.div>
          <p className="text-sm text-stardust-400 mt-2 text-center">Production Ready Score</p>
        </div>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="solar" className="mb-3">
              SENIOR ENGINEER ASSESSMENT
            </Badge>
            <h2 className="text-3xl font-display font-bold text-stardust-100 mb-3 leading-tight">
              {project?.name || "NexaCommerce"} demonstrates production-grade engineering with identifiable growth areas.
            </h2>
            <p className="text-stardust-400 text-base leading-relaxed">
              At {project?.scores?.readiness || 84}/100, this codebase would pass a senior engineer review at most scale-ups.
              The architecture is sound, TypeScript usage is exemplary, and the Stripe integration
              reflects genuine production experience. A focused 2-week sprint could bring this to 95+.
            </p>
            <div className="mt-5 flex gap-3">
              <Badge variant="aurora">Strong Foundation</Badge>
              <Badge variant="nebula">Scalable Architecture</Badge>
              <Badge variant="solar">Production-Ready Core</Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {VERDICT_SECTIONS.map((section) => (
          <Card key={section.title} glow className={cn("p-5 border", section.borderClass)}>
            <h3 className={cn("text-base font-display font-semibold mb-3 flex items-center gap-2", section.titleClass)}>
              <span>{section.icon}</span>
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-stardust-300">
                  <span className={cn("mt-0.5 shrink-0", section.titleClass)}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </StaggerReveal>

      <div className="flex flex-col items-center gap-6">
        {!verdict && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateVerdict}
              disabled={generating}
              className="px-16 py-4 text-base !bg-gradient-to-r !from-solar-600 !to-nebula-600 hover:!from-solar-500 hover:!to-nebula-500"
              icon={
                generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Crown className="w-5 h-5" />
                )
              }
            >
              {generating ? "The Council Deliberates..." : "Generate The Full Verdict"}
            </Button>
            <p className="text-xs text-stardust-500 mt-3">
              Powered by Grok — a full narrative review of your codebase
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {verdict && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Card glow className="p-8 border border-solar-500/30 bg-solar-500/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-solar-400" />
                    <h3 className="text-lg font-display font-bold text-stardust-100">
                      The Full Verdict
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Copy className="w-4 h-4" />}
                      onClick={handleCopyVerdict}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      onClick={handleExportVerdict}
                    >
                      Export
                    </Button>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-stardust-200 leading-relaxed font-body">
                    {verdict}
                  </pre>
                </div>
              </Card>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-10 pb-4"
              >
                <p className="text-2xl font-display font-bold bg-gradient-to-r from-solar-400 via-nebula-300 to-aurora-400 bg-clip-text text-transparent">
                  ✦ Your legend has been written. ✦
                </p>
                <p className="text-stardust-500 text-sm mt-2">
                  The Hero&apos;s Journey is complete. Now go conquer the interview.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
