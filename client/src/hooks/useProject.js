import { useProjectStore } from "@/store/projectStore";
import { useEffect, useState } from "react";

export function useProject() {
  const store = useProjectStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    project: mounted ? store.project : null,
    isAnalyzing: mounted ? store.isAnalyzing : false,
    analysisProgress: mounted ? store.analysisProgress : 0,
    analysisMessage: mounted ? store.analysisMessage : "",
    hasProject: mounted ? store.hasProject : false,
    fileContents: mounted ? store.project?.fileContents || {} : {},
    setProject: store.setProject,
    startAnalysis: store.startAnalysis,
    updateProgress: store.updateProgress,
    completeAnalysis: store.completeAnalysis,
    reset: store.reset,
    isMounted: mounted,
  };
}
