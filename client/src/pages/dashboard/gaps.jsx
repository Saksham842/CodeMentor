import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Loader2, Sparkles } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { RadarChart } from "@/components/charts/RadarChart";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const SKILLS = [];

const STUDY_PLAN = [];

const TIER_CONFIG = {
  strong: {
    label: "Strong",
    border: "border-aurora-500/30",
    bg: "bg-aurora-500/5",
    badge: "aurora",
  },
  developing: {
    label: "Developing",
    border: "border-solar-500/30",
    bg: "bg-solar-500/5",
    badge: "solar",
  },
  weak: {
    label: "Needs Focus",
    border: "border-nova-500/30",
    bg: "bg-nova-500/5",
    badge: "supernova",
  },
};

export default function GapsPage() {
  const { project } = useProject();
  const [studyScroll, setStudyScroll] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateScroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "study_scroll",
          weakSkills: SKILLS.filter((s) => s.tier === "weak").map((s) => s.name),
          developingSkills: SKILLS.filter((s) => s.tier === "developing").map((s) => s.name),
          projectContext: buildContextString(project),
        }),
      });
      const data = await res.json();
      setStudyScroll(data.result ?? "Your personalised study scroll is being forged...");
    } catch {
      showToast.error("The scroll could not be generated.");
    } finally {
      setLoading(false);
    }
  };

  const tiers = ["strong", "developing", "weak"];

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XII"
        title="Know Thyself"
        subtitle="Every hero has blind spots. These are the gaps revealed by your council sessions — face them with courage."
        icon={<Brain className="w-6 h-6 text-nebula-400" />}
      />

      <Card glow className="p-6 mb-8">
        <h3 className="text-lg font-display font-semibold text-stardust-100 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-nebula-400" />
          Skill Radar
        </h3>
        <div className="flex justify-center">
          <RadarChart />
        </div>
      </Card>

      <StaggerReveal>
        {tiers.map((tier) => {
          const cfg = TIER_CONFIG[tier];
          const skills = SKILLS.filter((s) => s.tier === tier);
          return (
            <Card key={tier} glow className={cn("p-6 mb-6 border", cfg.border, cfg.bg)}>
              <div className="flex items-center gap-3 mb-5">
                <Badge variant={cfg.badge}>{cfg.label}</Badge>
                <span className="text-stardust-400 text-sm">{skills.length} skills</span>
              </div>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-stardust-200 text-sm font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stardust-400 font-mono">{skill.area}</span>
                        <span className="text-sm font-bold text-stardust-100">{skill.score}%</span>
                      </div>
                    </div>
                    <ScoreBar
                      score={skill.score}
                      max={100}
                      color={
                        tier === "strong" ? "aurora" : tier === "developing" ? "solar" : "nova"
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </StaggerReveal>

      <div className="mt-10">
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-6">
          Your 3-Week Battle Plan
        </h3>
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STUDY_PLAN.map((week) => (
            <Card key={week.week} elevated glow className="p-5">
              <Badge
                variant={
                  week.color === "aurora"
                    ? "aurora"
                    : week.color === "nebula"
                    ? "nebula"
                    : "supernova"
                }
                className="mb-3"
              >
                {week.week}
              </Badge>
              <h4 className="text-base font-display font-semibold text-stardust-100 mb-3">
                {week.focus}
              </h4>
              <ul className="space-y-2">
                {week.tasks.map((task, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stardust-300">
                    <span className="text-nebula-400 mt-0.5 shrink-0">▸</span>
                    {task}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </StaggerReveal>
      </div>

      <div className="flex justify-center mt-10">
        <Button
          variant="primary"
          size="lg"
          onClick={generateScroll}
          disabled={loading}
          icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        >
          {loading ? "Forging Scroll..." : "Generate My Study Scroll"}
        </Button>
      </div>

      <SlideOver
        open={!!studyScroll}
        onClose={() => setStudyScroll(null)}
        title="Your Personal Study Scroll"
      >
        <div className="prose prose-invert max-w-none">
          <div className="p-4 rounded-xl bg-vault-700/30 border border-vault-600/30">
            <pre className="whitespace-pre-wrap text-sm text-stardust-200 font-mono leading-relaxed">
              {studyScroll}
            </pre>
          </div>
        </div>
      </SlideOver>
    </PageWrapper>
  );
}
