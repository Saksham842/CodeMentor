import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { SystemDiagram } from "@/components/architecture/SystemDiagram";
import { AuthFlow } from "@/components/architecture/AuthFlow";
import { DBSchema } from "@/components/architecture/DBSchema";
import { Card } from "@/components/ui/Card";
import { Network, ShieldCheck, Database } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function ArchitecturePage() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState("system");

  const tabs = [
    { id: "system", label: "System Diagram" },
    { id: "auth", label: "Auth Flow" },
    { id: "db", label: "DB Schema" }
  ];

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter IV" title="Blueprint of the Realm" />

      <div className="space-y-6">
        <p className="text-xs text-stardust/60 max-w-2xl leading-relaxed">
          Inspect the system architecture, authentication sequence flow, and database relational models of {project?.name || "this project"}.
        </p>

        <div className="flex justify-between items-center border-b border-rift pb-px">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-comet tracking-widest font-mono">
            {activeTab === "system" && <Network className="w-4 h-4 text-nebula" />}
            {activeTab === "auth" && <ShieldCheck className="w-4 h-4 text-aurora" />}
            {activeTab === "db" && <Database className="w-4 h-4 text-cosmic" />}
            <span>Vector Link Active</span>
          </span>
        </div>

        <Card glow className="p-4 bg-cavern/20 border-rift min-h-[420px] flex items-center justify-center relative overflow-hidden">
          {activeTab === "system" && <SystemDiagram />}
          {activeTab === "auth" && <AuthFlow />}
          {activeTab === "db" && <DBSchema />}
        </Card>
      </div>
    </PageWrapper>
  );
}
