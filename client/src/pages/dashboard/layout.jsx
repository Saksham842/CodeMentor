import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AnalysisLoader } from "@/components/upload/AnalysisLoader";
import { AnimatePresence } from "framer-motion";
import { useProject } from "@/hooks/useProject";

export default function DashboardLayout() {
  const { isAnalyzing } = useProject();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-void relative">
      <AnalysisLoader />
      <Sidebar className="shrink-0" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto bg-abyss select-text relative scrollbar-thin">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
