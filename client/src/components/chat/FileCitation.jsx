import { cn } from "@/lib/utils";
import { FileCode } from "lucide-react";

export function FileCitation({ filePath, onClick, className }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(filePath)}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-void/50 border border-rift text-[11px] font-mono text-comet hover:text-white hover:border-nebula/40 transition-all cursor-pointer",
        className
      )}
    >
      <FileCode className="w-3.5 h-3.5 text-aurora" />
      <span>{filePath}</span>
    </button>
  );
}
