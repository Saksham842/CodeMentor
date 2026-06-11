import { useEffect, useRef } from "react";
import { useProject } from "@/hooks/useProject";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { animateCount } from "@/hooks/useAnimation";
import {
  FileText,
  Binary,
  Layers,
  ShieldCheck,
  Compass,
  ArrowRight,
  Terminal,
  Play,
  History,
  Lock,
  Zap,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardOverview() {
  const { project } = useProject();

  const filesRef = useRef(null);
  const locRef = useRef(null);
  const funcRef = useRef(null);
  const issueRef = useRef(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    if (filesRef.current) animateCount(filesRef.current, project?.stats?.files || 0, 1.5);
    if (locRef.current) animateCount(locRef.current, project?.stats?.loc || 0, 1.8);
    if (funcRef.current) animateCount(funcRef.current, project?.stats?.functions || 0, 1.6);
    if (issueRef.current) animateCount(issueRef.current, project?.securityIssues?.length || 0, 1.2);
    if (scoreRef.current) animateCount(scoreRef.current, project?.scores?.readiness || 0, 1.5);
  }, [project]);

  const stats = [
    { label: "Decoded Files", ref: filesRef, icon: FileText, color: "text-nebula" },
    { label: "Lines of Code", ref: locRef, icon: Binary, color: "text-aurora" },
    { label: "Functions mapped", ref: funcRef, icon: Layers, color: "text-cosmic" },
    { label: "Vulnerabilities", ref: issueRef, icon: ShieldCheck, color: "text-supernova" },
    { label: "Readiness Score", ref: scoreRef, icon: Activity, color: "text-nova", suffix: "%" }
  ];

  const quickActions = [
    { title: "Speak to the Oracle", desc: "Ask AI questions about coding details.", href: "/dashboard/chat", icon: Terminal },
    { name: "Explore Ancient Scrolls", desc: "Read files with deep explainer drawers.", href: "/dashboard/explorer", icon: Compass },
    { name: "Trial of Knowledge", desc: "Assess your memory with modular tests.", href: "/dashboard/quiz", icon: Play },
    { name: "Facing the Council", desc: "Practice mock developer interviews.", href: "/dashboard/interview", icon: History },
    { name: "Breach Point scan", desc: "Audit and fix security weaknesses.", href: "/dashboard/security", icon: Lock },
    { name: "Shadows in Code", desc: "Track code bugs and apply repairs.", href: "/dashboard/bugs", icon: Zap }
  ];

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter I" title="The Lay of the Land" />

      <div className="space-y-8 select-none">

        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} glow className="p-5 flex flex-col justify-between h-[130px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-comet/70 tracking-[0.15em]">
                    {stat.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rift to-cavern flex items-center justify-center border border-rift/50">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">
                  <span ref={stat.ref}>0</span>
                  {stat.suffix}
                </div>
              </Card>
            );
          })}
        </StaggerReveal>

        <Card glow elevated className="p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-nebula/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-aurora/5 to-transparent rounded-full blur-2xl" />
          <div className="relative z-10">
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-nebula mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula animate-pulse" />
              Current Quest Summary
            </h3>
            <p className="text-sm text-stardust/80 leading-relaxed max-w-3xl">
              {project?.name || "This project"} is a {project?.tagline || "software project"} being analyzed for knowledge gaps, security issues, and interview readiness. Your journey through this codebase begins now.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <Card glow className="p-7 space-y-5 lg:col-span-2">
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
              Decoded Tech Stack
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-comet/60 font-mono uppercase tracking-wider">Frontend Tier:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(project?.stack?.frontend || []).map((t) => (
                    <Badge key={t} variant="nebula">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-comet/60 font-mono uppercase tracking-wider">Backend engine:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(project?.stack?.backend || []).map((t) => (
                    <Badge key={t} variant="aurora">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-comet/60 font-mono uppercase tracking-wider">Data Vaults:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(project?.stack?.database || []).map((t) => (
                    <Badge key={t} variant="cosmic">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card glow className="p-7 space-y-5">
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
              Project Health Metrics
            </h3>
            <div className="space-y-4">
              <ScoreBar label="Security Level" value={project?.scores?.security || 71} colorClass="bg-supernova" />
              <ScoreBar label="Maintainability" value={project?.scores?.maintainability || 75} colorClass="bg-nebula" />
              <ScoreBar label="Test Coverage" value={project?.scores?.coverage || 45} colorClass="bg-solar" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card glow className="p-7 space-y-4">
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
              Key Entry Points
            </h3>
            <div className="space-y-3">
              {(project?.entryPoints || [
                { file: "src/app/layout.tsx", purpose: "Root layout parameters." }
              ]).map((ep) => (
                <div key={ep.file} className="flex flex-col border border-rift/50 rounded-xl p-3.5 bg-void/30 hover:bg-rift/20 hover:border-nebula/30 transition-all group">
                  <span className="text-xs font-mono font-semibold text-white group-hover:text-gradient transition-all">{ep.file}</span>
                  <span className="text-xs text-stardust/60 mt-1.5 leading-relaxed">{ep.purpose}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <span>Sandbox Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} to={action.href}>
                  <Card glow className="p-5 flex flex-col justify-between h-[100px] cursor-pointer group">
                    <span className="text-xs font-bold text-white uppercase truncate tracking-wider group-hover:text-gradient transition-all">{action.name || action.title}</span>
                    <span className="text-[10px] text-stardust/50 mt-1 leading-relaxed line-clamp-2">{action.desc}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
