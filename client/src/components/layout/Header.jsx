import { useLocation } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Button } from "../ui/Button";
import { Bell, Upload } from "lucide-react";
import { useState } from "react";
import { UploadModal } from "../upload/UploadModal";

export function Header() {
  const { pathname } = useLocation();
  const { project } = useProject();
  const [showUpload, setShowUpload] = useState(false);

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/dashboard":
        return { chapter: "CHAPTER I", title: "Overview" };
      case "/dashboard/chat":
        return { chapter: "CHAPTER II", title: "Codebase Chat" };
      case "/dashboard/explorer":
        return { chapter: "CHAPTER III", title: "File Explorer" };
      case "/dashboard/architecture":
        return { chapter: "CHAPTER IV", title: "Architecture" };
      case "/dashboard/search":
        return { chapter: "CHAPTER V", title: "Code Search" };
      case "/dashboard/onboarding":
        return { chapter: "CHAPTER VI", title: "Onboarding Mode" };
      case "/dashboard/roadmap":
        return { chapter: "CHAPTER VII", title: "Roadmap" };
      case "/dashboard/quiz":
        return { chapter: "CHAPTER VIII", title: "Quiz Mode" };
      case "/dashboard/timeline":
        return { chapter: "CHAPTER IX", title: "Project Timeline" };
      case "/dashboard/interview":
        return { chapter: "CHAPTER X", title: "Mock Interview" };
      case "/dashboard/defense":
        return { chapter: "CHAPTER XI", title: "Project Defense" };
      case "/dashboard/gaps":
        return { chapter: "CHAPTER XII", title: "Knowledge Gaps" };
      case "/dashboard/resume":
        return { chapter: "CHAPTER XIII", title: "Resume Builder" };
      case "/dashboard/docs":
        return { chapter: "CHAPTER XIV", title: "Auto Docs" };
      case "/dashboard/contributor":
        return { chapter: "CHAPTER XV", title: "Contributor Guide" };
      case "/dashboard/knowledge-base":
        return { chapter: "CHAPTER XVI", title: "Knowledge Base" };
      case "/dashboard/security":
        return { chapter: "CHAPTER XVII", title: "Security Scan" };
      case "/dashboard/complexity":
        return { chapter: "CHAPTER XVIII", title: "Complexity" };
      case "/dashboard/bugs":
        return { chapter: "CHAPTER XIX", title: "Bug Detector" };
      case "/dashboard/reviewer":
        return { chapter: "CHAPTER XX", title: "AI Reviewer" };
      case "/dashboard/settings":
        return { chapter: "SETTINGS", title: "Codex Settings" };
      default:
        return { chapter: "QUEST", title: "Dashboard" };
    }
  };

  const bc = getBreadcrumb();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-rift bg-void/70 px-6 backdrop-blur-md">
      <div className="flex flex-col">
        <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-comet leading-none mb-1">
          {bc.chapter}
        </span>
        <span className="text-sm font-display font-semibold text-white tracking-wide leading-none">
          {bc.title}
        </span>
      </div>

      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cavern border border-rift text-xs">
        <span className="font-semibold text-stardust uppercase tracking-wider text-[10px]">
          {project?.name || "NexaCommerce"}
        </span>
        <div className="h-3 w-px bg-rift" />
        <span className="text-comet font-medium">Health:</span>
        <span className="font-mono font-bold text-nova drop-shadow-[0_0_8px_#10b981]">
          {project?.scores?.readiness || 84}/100
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 text-xs py-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Quest</span>
        </Button>

        <button className="relative rounded-lg p-1.5 text-comet hover:text-white hover:bg-rift/40 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-supernova" />
        </button>

        <div className="w-8 h-8 rounded-full border border-rift overflow-hidden bg-vault flex items-center justify-center cursor-pointer hover:border-nebula/40 transition-colors">
          <div className="w-full h-full bg-gradient-to-tr from-aurora to-nebula flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
        </div>
      </div>

      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </header>
  );
}
