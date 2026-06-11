import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProjectStore = create()(
  persist(
    (set) => ({
      project: null,
      isAnalyzing: false,
      analysisProgress: 0,
      analysisMessage: "",
      hasProject: false,
      setProject: (project) => set({ project, hasProject: !!project }),
      startAnalysis: (message) => set({ isAnalyzing: true, analysisProgress: 0, analysisMessage: message }),
      updateProgress: (progress, message) => set({ analysisProgress: progress, analysisMessage: message }),
      completeAnalysis: (project) => set({ project, hasProject: true, isAnalyzing: false, analysisProgress: 100, analysisMessage: "Complete" }),
      reset: () => set({ project: null, hasProject: false, isAnalyzing: false, analysisProgress: 0, analysisMessage: "" })
    }),
    {
      name: "codementor-project-store",
      partialize: (state) => ({
        project: state.project,
        hasProject: state.hasProject,
      }),
    }
  )
);
