import { useState } from "react";
import { motion } from "framer-motion";
import { Scroll, RefreshCw, Loader2, FileText, Linkedin, Globe, Target } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import BulletEditor from "@/components/resume/BulletEditor";
import ExportButtons from "@/components/resume/ExportButtons";
import { showToast } from "@/components/ui/Toast";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const LINKEDIN_ABOUT = `Results-driven full-stack engineer with hands-on experience building production-grade e-commerce platforms at scale. Led development of NexaCommerce — a multi-vendor marketplace processing 50K+ daily transactions — using Next.js, Node.js, and PostgreSQL. Passionate about clean architecture, developer experience, and shipping products that users love.

Open to senior engineer and tech-lead opportunities in product-focused teams.`;

const PORTFOLIO_BIO = `# Shoaib Ahmed — Full-Stack Engineer

## About
I build scalable web applications that solve real business problems. My latest project, **NexaCommerce**, is a production-grade multi-vendor e-commerce platform featuring real-time inventory, Stripe Connect, advanced search, and a micro-frontend architecture.

## Featured Project: NexaCommerce
- **Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Redis, Stripe
- **Scale:** 50K+ daily transactions, 98% uptime, sub-200ms API response times
- **Architecture:** Modular monolith with event-driven patterns

## Skills
React · Next.js · Node.js · TypeScript · PostgreSQL · Redis · Docker · AWS`;

const ATS_SUMMARY = `Full-Stack Software Engineer | React | Next.js | Node.js | TypeScript | PostgreSQL | Redis | AWS | Docker | CI/CD | REST APIs | GraphQL | System Design | Agile

Experienced full-stack engineer specialising in high-performance web applications. Proficient in React ecosystem (Next.js, React Query, Zustand), backend development (Node.js, Express, NestJS), and cloud infrastructure (AWS EC2, S3, RDS). Strong understanding of software design patterns, database optimisation, and security best practices. Proven ability to deliver complex features end-to-end in fast-paced startup environments.

Key Achievements:
• Architected multi-vendor marketplace processing 50,000+ daily transactions
• Reduced API response times by 40% via Redis caching and query optimisation  
• Implemented Stripe Connect with automated payout reconciliation
• Led migration from REST to GraphQL, cutting over-fetching by 60%`;

const TABS = [
  { id: "bullets", label: "Resume Bullets", icon: <FileText className="w-4 h-4" /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
  { id: "portfolio", label: "Portfolio", icon: <Globe className="w-4 h-4" /> },
  { id: "ats", label: "ATS Summary", icon: <Target className="w-4 h-4" /> },
];

export default function ResumePage() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState("bullets");
  const [bullets, setBullets] = useState(project?.resumeBullets || []);
  const [linkedinText, setLinkedinText] = useState(LINKEDIN_ABOUT);
  const [portfolioText, setPortfolioText] = useState(PORTFOLIO_BIO);
  const [atsText, setAtsText] = useState(ATS_SUMMARY);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/grok/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: project?.name,
          techStack: project?.stack,
          projectContext: buildContextString(project),
          type: activeTab,
        }),
      });
      const data = await res.json();

      if (activeTab === "bullets" && data.bullets) {
        setBullets(data.bullets);
        showToast.success("Resume bullets regenerated!");
      } else if (activeTab === "linkedin" && data.result) {
        setLinkedinText(data.result);
        showToast.success("LinkedIn bio regenerated!");
      } else if (activeTab === "portfolio" && data.result) {
        setPortfolioText(data.result);
        showToast.success("Portfolio bio regenerated!");
      } else if (activeTab === "ats" && data.result) {
        setAtsText(data.result);
        showToast.success("ATS summary regenerated!");
      }
    } catch {
      showToast.error("Grok could not forge the legend.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XIII"
        title="Forge Your Legend"
        subtitle="Transform your codebase mastery into career ammunition. Every line, every decision — your story to tell."
        icon={<Scroll className="w-6 h-6 text-solar-400" />}
      />

      <div className="flex items-center justify-between mb-6">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRegenerate}
          disabled={regenerating}
          icon={
            regenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )
          }
        >
          {regenerating ? "Forging..." : "Regenerate with Grok"}
        </Button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "bullets" && (
          <div className="space-y-6">
            <Card glow className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-semibold text-stardust-100">
                  ATS-Optimised Resume Bullets
                </h3>
                <ExportButtons bullets={bullets} />
              </div>
              <BulletEditor bullets={bullets} onChange={setBullets} />
            </Card>

            <Card glow className="p-4 border border-nebula-500/20 bg-nebula-500/5">
              <p className="text-sm text-stardust-400">
                💡 <span className="text-nebula-300 font-medium">Pro tip:</span> Each bullet
                follows the XYZ formula — "Accomplished [X] as measured by [Y], by doing [Z]".
                Edit freely to match your exact contributions.
              </p>
            </Card>
          </div>
        )}

        {activeTab === "linkedin" && (
          <Card glow className="p-6">
            <h3 className="text-base font-display font-semibold text-stardust-100 mb-4">
              LinkedIn About Section
            </h3>
            <textarea
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              rows={12}
              className="w-full bg-void-950/60 border border-vault-600/50 rounded-xl px-4 py-3 text-sm text-stardust-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-nebula-500/30 resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-stardust-500 font-mono">
                {linkedinText.length}/2,600 chars
              </span>
              <ExportButtons bullets={[linkedinText]} exportLabel="Copy to Clipboard" />
            </div>
          </Card>
        )}

        {activeTab === "portfolio" && (
          <Card glow className="p-6">
            <h3 className="text-base font-display font-semibold text-stardust-100 mb-4">
              Portfolio / README.md Bio
            </h3>
            <textarea
              value={portfolioText}
              onChange={(e) => setPortfolioText(e.target.value)}
              rows={16}
              className="w-full bg-void-950/60 border border-vault-600/50 rounded-xl px-4 py-3 text-sm text-stardust-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-nebula-500/30 resize-none"
            />
            <div className="flex justify-end mt-3">
              <ExportButtons bullets={[portfolioText]} exportLabel="Download .md" />
            </div>
          </Card>
        )}

        {activeTab === "ats" && (
          <Card glow className="p-6">
            <h3 className="text-base font-display font-semibold text-stardust-100 mb-2">
              ATS Resume Summary
            </h3>
            <p className="text-xs text-stardust-400 mb-4">
              Paste this at the top of your resume as a Professional Summary section for maximum ATS keyword coverage.
            </p>
            <textarea
              value={atsText}
              onChange={(e) => setAtsText(e.target.value)}
              rows={14}
              className="w-full bg-void-950/60 border border-vault-600/50 rounded-xl px-4 py-3 text-sm text-stardust-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-nebula-500/30 resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-stardust-500 font-mono">
                {atsText.split(/\s+/).length} words
              </span>
              <ExportButtons bullets={[atsText]} exportLabel="Copy ATS Summary" />
            </div>
          </Card>
        )}
      </motion.div>
    </PageWrapper>
  );
}
