import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useProject } from "@/hooks/useProject";

export default function RoadmapPage() {
  const { project } = useProject();

  const [beginner, setBeginner] = useState(
    project?.roadmap?.beginner?.map((t) => ({ id: t.id, name: t.name, hours: t.hours, files: t.relatedFiles, status: t.status })) || []
  );

  const [intermediate, setIntermediate] = useState(
    project?.roadmap?.intermediate?.map((t) => ({ id: t.id, name: t.name, hours: t.hours, files: t.relatedFiles, status: t.status })) || []
  );

  const [advanced, setAdvanced] = useState(
    project?.roadmap?.advanced?.map((t) => ({ id: t.id, name: t.name, hours: t.hours, files: t.relatedFiles, status: t.status })) || []
  );

  const toggleTopic = (track, id) => {
    const updater = (prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "Complete" ? "Not Started" : "Complete";
          return { ...t, status: nextStatus };
        }
        return t;
      });

    if (track === "beg") setBeginner(updater);
    else if (track === "int") setIntermediate(updater);
    else setAdvanced(updater);
  };

  const getTrackProgress = (list) => {
    const done = list.filter((t) => t.status === "Complete").length;
    return Math.round((done / list.length) * 100);
  };

  const bProg = getTrackProgress(beginner);
  const iProg = getTrackProgress(intermediate);
  const aProg = getTrackProgress(advanced);

  const totalProgress = Math.round((bProg + iProg + aProg) / 3);

  const renderColumn = (title, list, trackKey, prog, glowClass) => {
    return (
      <div className="space-y-6 flex-1 min-w-[280px]">
        <div className="flex items-center justify-between pb-3 border-b border-rift select-none">
          <div className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", glowClass)} />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">{title}</h3>
          </div>
          <span className="font-mono text-xs text-comet font-semibold">{prog}%</span>
        </div>

        <div className="w-full h-1 bg-rift rounded-full overflow-hidden">
          <div className={cn("h-full transition-all duration-500", glowClass.replace("bg-", "bg-"))} style={{ width: `${prog}%` }} />
        </div>

        <div className="space-y-3">
          {list.map((topic) => {
            const isDone = topic.status === "Complete";
            return (
              <Card
                key={topic.id}
                glow
                className={cn(
                  "p-4 space-y-3 bg-cavern/50 relative text-left",
                  isDone ? "shimmer-bg border-nova/30 bg-nova/5" : ""
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className={cn("text-xs font-bold text-white uppercase tracking-wide", isDone ? "line-through text-stardust/40" : "")}>
                      {topic.name}
                    </h4>
                    <span className="block text-[10px] text-stardust/50 font-semibold font-mono">
                      ⏳ {topic.hours} hours estimated
                    </span>
                  </div>

                  <button
                    onClick={() => toggleTopic(trackKey, topic.id)}
                    className={cn(
                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                      isDone ? "bg-nova border-nova text-white" : "border-rift hover:border-nebula/50 bg-void/30"
                    )}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {topic.files.map((f) => (
                    <Badge key={f} variant="comet" className="font-mono text-[9px] lowercase">
                      {f.split("/").pop()}
                    </Badge>
                  ))}
                  <Badge variant={isDone ? "nova" : topic.status === "In Progress" ? "solar" : "comet"}>
                    {topic.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter VII" title="The Three Paths" />

      <div className="space-y-8">

        <div className="flex flex-col md:flex-row items-center gap-8 justify-around p-6 border border-rift rounded-xl bg-cavern/30 select-none">
          <div className="space-y-2 text-center md:text-left max-w-sm">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Overall Quest Progress</h3>
            <p className="text-xs text-stardust/80 leading-relaxed">
              Complete study topics across the beginner, intermediate, and advanced columns to increase your readiness credentials.
            </p>
          </div>
          <ProgressRing value={totalProgress} size={110} strokeWidth={7} color="stroke-nebula" label="Path Progress" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {renderColumn("Beginner Path", beginner, "beg", bProg, "bg-cosmic")}
          {renderColumn("Intermediate Path", intermediate, "int", iProg, "bg-nebula")}
          {renderColumn("Advanced Path", advanced, "adv", aProg, "bg-solar")}
        </div>

      </div>
    </PageWrapper>
  );
}
