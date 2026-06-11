import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FolderOpen, FileCode2, ChevronRight, ChevronDown } from "lucide-react";

export function FileTree({ node, selectedPath, onSelect, depth = 0 }) {
  const isDirectory = node.type === "directory";
  const [isOpen, setIsOpen] = useState(depth === 0 || depth === 1);
  const isSelected = selectedPath === node.path;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.path);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop();
    switch (ext) {
      case "tsx":
        return <FileCode2 className="w-4 h-4 text-sky-400" />;
      case "ts":
        return <FileCode2 className="w-4 h-4 text-indigo-400" />;
      case "json":
        return <FileCode2 className="w-4 h-4 text-yellow-500" />;
      case "prisma":
        return <FileCode2 className="w-4 h-4 text-teal-400" />;
      case "dockerfile":
        return <FileCode2 className="w-4 h-4 text-cyan-500" />;
      default:
        return <FileCode2 className="w-4 h-4 text-comet" />;
    }
  };

  return (
    <div className="select-none font-mono text-xs">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={cn(
          "flex items-center gap-2 py-2 pr-4 rounded-lg cursor-pointer transition-colors border border-transparent",
          isSelected
            ? "bg-nebula/15 border-nebula/30 text-white font-semibold shadow-[inset_0_0_8px_rgba(124,58,237,0.1)]"
            : "text-stardust hover:bg-rift/20 hover:text-white"
        )}
      >
        {isDirectory ? (
          <>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-comet" /> : <ChevronRight className="w-3.5 h-3.5 text-comet" />}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-nebula drop-shadow-[0_0_4px_rgba(124,58,237,0.3)]" />
            ) : (
              <Folder className="w-4 h-4 text-nebula" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isDirectory && node.children && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileTree
                  key={child.path}
                  node={child}
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
