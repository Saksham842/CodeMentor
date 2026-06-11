import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sparkles, Flame, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function OnboardingPage() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState("day1");
  const [showChapterGuide, setShowChapterGuide] = useState(false);
  const [activeStepFile, setActiveStepFile] = useState("");
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const tabs = [
    { id: "day1", label: "Day 1: Core Vaults" },
    { id: "day2", label: "Day 2: Integrations" },
    { id: "day3", label: "Day 3: Containerization" }
  ];

  const stepsByDay = {
    day1: [
      { id: "s1", time: "10:00 AM", file: "src/lib/prisma.ts", concept: "Database Singleton", description: "Learn how the Prisma Client connects to PostgreSQL, ensuring connections are not exhausted during hot reload." },
      { id: "s2", time: "02:00 PM", file: "src/lib/auth.ts", concept: "Credentials Providers", description: "Understand how credentials verification compares password input ciphers against database hashes." },
      { id: "s3", time: "04:30 PM", file: "src/middleware.ts", concept: "JWT Route Filters", description: "Inspect how Next.js edge middleware parses incoming cookie validation claims." }
    ],
    day2: [
      { id: "s4", time: "11:00 AM", file: "src/app/api/stripe/webhook.ts", concept: "Webhook Validation", description: "Audit secure Stripe callback integrations ensuring signature verification prevents spoofing." },
      { id: "s5", time: "03:00 PM", file: "src/lib/redis.ts", concept: "Session Caching", description: "Optimize session storage speeds using Redis memory caches instead of persistent DB calls." }
    ],
    day3: [
      { id: "s6", time: "10:30 AM", file: "Dockerfile", concept: "Container Build", description: "Walk through multi-stage Docker commands to compile secure, lightweight production bundles." }
    ]
  };

  const handleBeginChapter = async (file) => {
    setActiveStepFile(file);
    setShowChapterGuide(true);
    setLoadingAI(true);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an onboarding mentor for ${project?.name || "this project"}. Teach the details of ${file} to a developer joining the team. Cover: purpose, design decisions, how it fits the system, code walkthrough, gotchas. Use code examples.`,
          projectContext: buildContextString(project)
        })
      });
      if (!res.ok) throw new Error("Grok service connection lost.");
      const data = await res.json();
      setAiText(data.result);
    } catch (err) {
      showToast.error("Failed to load onboarding study: " + err.message);
      setAiText("Failed to retrieve details. Ensure GROQ_API_KEY is configured.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter VI" title="The Mentor's Path" />

      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-rift rounded-xl bg-cavern/50 gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-nebula to-cosmic flex items-center justify-center text-white shadow-md shrink-0">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white uppercase">Onboarding Program</h3>
              <span className="text-xs text-stardust/70">Estimated ~9 hours to full codebase mastery.</span>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-nova uppercase tracking-widest flex items-center gap-1.5 bg-void/50 border border-rift px-3.5 py-1.5 rounded-lg self-start">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Guild Scroll</span>
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />

        <div className="relative border-l border-rift/60 pl-8 ml-4 py-4 space-y-8">
          {stepsByDay[activeTab].map((step, idx) => (
            <div key={step.id} className="relative">
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-cavern border border-rift flex items-center justify-center text-nebula font-bold text-[10px] shadow-lg">
                <div className="w-2 h-2 rounded-full bg-nebula animate-ping absolute" />
                <div className="w-2.5 h-2.5 rounded-full bg-nebula relative z-10" />
              </div>

              <Card glow className="p-5 space-y-4 max-w-3xl">
                <div className="flex justify-between items-center text-xs font-semibold text-comet">
                  <span className="font-mono">{step.time}</span>
                  <span className="bg-void/50 border border-rift px-2.5 py-0.5 rounded-md font-mono text-[10px] text-white">
                    {step.file.split("/").pop()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{step.concept}</h4>
                  <p className="text-xs text-stardust leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <Button
                  onClick={() => handleBeginChapter(step.file)}
                  className="flex items-center gap-1.5 text-xs py-1.5"
                  size="sm"
                >
                  <span>Begin This Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <SlideOver
        isOpen={showChapterGuide}
        onClose={() => setShowChapterGuide(false)}
        title={`Chapter Study: ${activeStepFile.split("/").pop()}`}
      >
        {loadingAI ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
            <RefreshCw className="w-8 h-8 text-nebula animate-spin" />
            <p className="text-sm font-mono text-gradient-aurora">Forging study scroll details...</p>
          </div>
        ) : (
          <div className="space-y-4 text-stardust leading-relaxed">
            {aiText.split("\n\n").map((chunk, i) => {
              if (chunk.includes("```")) {
                const code = chunk.replace(/```typescript|```/g, "").trim();
                return <CodeBlock key={i} code={code} language="typescript" />;
              }
              return <p key={i} className="text-sm">{chunk}</p>;
            })}
          </div>
        )}
      </SlideOver>
    </PageWrapper>
  );
}
