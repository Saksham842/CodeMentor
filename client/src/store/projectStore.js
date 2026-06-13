import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORE_VERSION = 2;

export const useProjectStore = create()(
  persist(
    (set) => ({
      project: null,
      fileContents: {},
      isAnalyzing: false,
      analysisProgress: 0,
      analysisMessage: "",
      hasProject: false,
      setProject: (project) => set({ project, hasProject: !!project }),
      setFileContents: (fileContents) => set({ fileContents }),
      startAnalysis: (message) => set({ isAnalyzing: true, analysisProgress: 0, analysisMessage: message }),
      updateProgress: (progress, message) => set({ analysisProgress: progress, analysisMessage: message }),
      completeAnalysis: (project) => set({ project, hasProject: true, isAnalyzing: false, analysisProgress: 100, analysisMessage: "Complete" }),
      reset: () => set({ project: null, fileContents: {}, hasProject: false, isAnalyzing: false, analysisProgress: 0, analysisMessage: "" })
    }),
    {
      name: "codementor-project-store",
      version: STORE_VERSION,
      migrate: (persisted, version) => {
        if (version < 2) {
          return { project: persisted.project || null, hasProject: !!persisted.project, isAnalyzing: false, analysisProgress: 0, analysisMessage: "" };
        }
        return persisted;
      },
      partialize: (state) => ({
        project: state.project ? Object.fromEntries(Object.entries(state.project).filter(([k]) => k !== "fileContents")) : null,
        hasProject: state.hasProject,
      }),
    }
  )
);
