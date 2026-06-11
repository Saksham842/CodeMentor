import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import {
  LayoutDashboard,
  MessageSquareCode,
  FolderTree,
  Network,
  Search,
  BookOpen,
  Compass,
  HelpCircle,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  FileText,
  ShieldAlert,
  Brain,
  FileSignature,
  FileCheck2,
  Users2,
  Library,
  Settings,
  User,
  ChevronDown
} from "lucide-react";

export function Sidebar({ className }) {
  const { pathname } = useLocation();
  const { project } = useProject();

  const navGroups = [
    {
      title: "UNDERSTAND",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Codebase Chat", href: "/dashboard/chat", icon: MessageSquareCode },
        { name: "File Explorer", href: "/dashboard/explorer", icon: FolderTree },
        { name: "Architecture", href: "/dashboard/architecture", icon: Network },
        { name: "Code Search", href: "/dashboard/search", icon: Search },
      ],
    },
    {
      title: "LEARN",
      items: [
        { name: "Onboarding Mode", href: "/dashboard/onboarding", icon: BookOpen },
        { name: "Roadmap", href: "/dashboard/roadmap", icon: Compass },
        { name: "Quiz Mode", href: "/dashboard/quiz", icon: HelpCircle },
        { name: "Project Timeline", href: "/dashboard/timeline", icon: Clock },
      ],
    },
    {
      title: "PRACTICE",
      items: [
        { name: "Mock Interview", href: "/dashboard/interview", icon: Users2 },
        { name: "Project Defense", href: "/dashboard/defense", icon: ShieldAlert },
        { name: "Knowledge Gaps", href: "/dashboard/gaps", icon: Brain },
      ],
    },
    {
      title: "GENERATE",
      items: [
        { name: "Resume Builder", href: "/dashboard/resume", icon: FileSignature },
        { name: "Auto Docs", href: "/dashboard/docs", icon: FileText },
        { name: "Contributor Guide", href: "/dashboard/contributor", icon: FileCheck2 },
        { name: "Knowledge Base", href: "/dashboard/knowledge-base", icon: Library },
      ],
    },
    {
      title: "ANALYZE",
      items: [
        { name: "Security Scan", href: "/dashboard/security", icon: ShieldCheck },
        { name: "Complexity", href: "/dashboard/complexity", icon: Activity },
        { name: "Bug Detector", href: "/dashboard/bugs", icon: Zap },
        { name: "AI Reviewer", href: "/dashboard/reviewer", icon: Award },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col w-[260px] h-screen border-r border-rift bg-abyss text-stardust select-none overflow-y-auto scrollbar-thin z-30",
        className
      )}
      style={{
        backgroundImage: "radial-gradient(rgba(124, 58, 237, 0.05) 1px, transparent 0)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-rift bg-void/50">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/logo.svg" className="w-8 h-8" alt="CodeMentor Logo" />
          <span className="font-display font-bold text-sm tracking-widest text-white uppercase">
            CodeMentor <span className="text-gradient">AI</span>
          </span>
        </Link>
      </div>

      <div className="p-4 border-b border-rift">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-cavern border border-rift text-xs font-semibold text-white hover:border-nebula/40 cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nova animate-pulse" />
            <span>{project?.name || "NexaCommerce"}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-comet" />
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <span className="block px-3 text-[10px] font-display font-bold tracking-wider text-comet opacity-70">
              ⬡ {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-gradient-to-r from-nebula/20 to-aurora/10 text-white border-l-2 border-nebula shadow-[0_0_15px_rgba(124,58,237,0.1)] font-semibold"
                        : "hover:bg-rift/25 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-nebula drop-shadow-[0_0_8px_#7c3aed]" : "text-comet"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-rift bg-void/50 mt-auto space-y-3">
        <Link
          to="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rift/25 hover:text-white transition-all",
            pathname === "/dashboard/settings" && "bg-rift/30 text-white"
          )}
        >
          <Settings className="w-4 h-4 text-comet" />
          <span>Settings</span>
        </Link>
        
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cavern border border-rift">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula to-cosmic flex items-center justify-center text-white font-display font-bold text-xs shadow-md">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Adventurer</p>
            <span className="text-[10px] text-comet uppercase font-semibold">Tier: Legendary</span>
          </div>
        </div>

        <div className="text-[9px] text-center text-stardust/40 uppercase tracking-widest font-semibold pt-1">
          Powered by Grok-3
        </div>
      </div>
    </aside>
  );
}
