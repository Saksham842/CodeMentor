import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, Clock, ChevronDown } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function TimelinePage() {
  const { project } = useProject();
  const [activeVersion, setActiveVersion] = useState("v0.4");

  const versions = project?.timeline || [];
  const active = versions.find((v) => v.version === activeVersion);

  const milestones = [
    { title: "Auth Fortress Built", desc: "NextAuth + Edge Middleware deployed to production environments.", date: "March 2026" },
    { title: "Payment Engine Live", desc: "Stripe webhook signature validation integrated with order fulfillment logic.", date: "April 2026" },
    { title: "Performance Optimized", desc: "Redis session caches reduced average API latency by 38%.", date: "May 2026" },
  ];

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter IX" title="The Chronicles" />

      <div className="space-y-10">
        <div className="relative overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max px-8 py-6 relative">
            <div className="absolute top-[50%] left-8 right-8 h-px bg-gradient-to-r from-nebula/20 via-nebula/60 to-nebula/20 -translate-y-1/2" />

            {versions.map((v, idx) => {
              const isActive = v.version === activeVersion;
              return (
                <div key={v.version} className="flex items-center">
                  <button
                    onClick={() => setActiveVersion(v.version)}
                    className="relative flex flex-col items-center gap-3 group z-10 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                      isActive
                        ? "bg-nebula border-nebula shadow-[0_0_15px_rgba(124,58,237,0.6)] scale-125"
                        : "bg-cavern border-rift group-hover:border-nebula/60"
                    }`}>
                      {isActive && <div className="absolute inset-0 rounded-full bg-nebula animate-ping opacity-30" />}
                    </div>

                    <div className="text-center">
                      <span className={`block text-xs font-display font-bold uppercase ${isActive ? "text-white" : "text-comet group-hover:text-white"}`}>
                        {v.version}
                      </span>
                      <span className="block text-[9px] text-stardust/40 font-mono whitespace-nowrap">{v.date}</span>
                    </div>
                  </button>

                  {idx < versions.length - 1 && (
                    <div className="w-24 h-px bg-rift mx-2 z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.version}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Card glow className="p-6 space-y-4 bg-cavern/40 border-nebula/20">
                <div className="flex items-center justify-between border-b border-rift pb-3">
                  <div className="flex items-center gap-3">
                    <GitCommit className="w-5 h-5 text-nebula" />
                    <h3 className="text-sm font-display font-bold text-white uppercase">{active.version} Release</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="nebula">{active.commits} commits</Badge>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-comet">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{active.date}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {active.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stardust">
                      <span className="text-nova mt-0.5 shrink-0">⬡</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-4">
            🏛️ Architecture Evolution Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <Card glow className="p-5 space-y-2 h-full bg-cavern/30 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nebula/50 to-aurora/50" />
                  <span className="block text-[10px] font-mono font-bold uppercase text-comet">{m.date}</span>
                  <h4 className="text-sm font-display font-bold text-white uppercase tracking-wide">{m.title}</h4>
                  <p className="text-xs text-stardust/80 leading-relaxed">{m.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
