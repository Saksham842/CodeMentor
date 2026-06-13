import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode2, FileJson, FileType, FileText } from "lucide-react";

const DEMO_TREE = {
  name: "project",
  type: "dir",
  open: true,
  children: [
    {
      name: "src",
      type: "dir",
      open: true,
      children: [
        {
          name: "components",
          type: "dir",
          open: false,
          children: [
            { name: "Header.tsx", type: "file" },
            { name: "Sidebar.tsx", type: "file" },
            { name: "FileTree.tsx", type: "file" },
          ],
        },
        {
          name: "pages",
          type: "dir",
          open: false,
          children: [
            { name: "index.tsx", type: "file" },
            { name: "dashboard.tsx", type: "file" },
            { name: "settings.tsx", type: "file" },
          ],
        },
        {
          name: "lib",
          type: "dir",
          open: false,
          children: [
            { name: "utils.ts", type: "file" },
            { name: "api.ts", type: "file" },
            { name: "db.ts", type: "file" },
          ],
        },
        { name: "App.tsx", type: "file" },
        { name: "main.tsx", type: "file" },
      ],
    },
    {
      name: "server",
      type: "dir",
      open: false,
      children: [
        { name: "routes", type: "dir", open: false, children: [
          { name: "auth.ts", type: "file" },
          { name: "api.ts", type: "file" },
        ]},
        { name: "controllers", type: "dir", open: false, children: [
          { name: "userController.ts", type: "file" },
        ]},
        { name: "server.ts", type: "file" },
      ],
    },
    {
      name: "package.json",
      type: "file",
    },
    {
      name: "tsconfig.json",
      type: "file",
    },
    {
      name: ".env",
      type: "file",
    },
  ],
};

function FileIcon({ name, isDir, isOpen }) {
  if (isDir) return isOpen ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400" />;
  const ext = name.split(".").pop();
  switch (ext) {
    case "tsx": return <FileCode2 className="w-4 h-4 text-sky-400" />;
    case "ts": return <FileCode2 className="w-4 h-4 text-indigo-400" />;
    case "json": return <FileJson className="w-4 h-4 text-yellow-500" />;
    case "env": return <FileType className="w-4 h-4 text-emerald-400" />;
    default: return <FileText className="w-4 h-4 text-stardust/50" />;
  }
}

function TreeNode({ node, depth, onToggle, revealed }) {
  const isDir = node.type === "dir";
  const [open, setOpen] = useState(node.open || false);

  useEffect(() => {
    if (node.open !== undefined) setOpen(node.open);
  }, [node.open]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDir) {
      setOpen(!open);
      onToggle?.(node.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: revealed * 0.04 }}
    >
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className="flex items-center gap-1.5 py-1.5 pr-3 rounded-md cursor-pointer text-xs text-stardust/70 hover:text-white hover:bg-rift/20 transition-all group"
      >
        {isDir && (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {!isDir && <span className="w-4 shrink-0" />}
        <FileIcon name={node.name} isDir={isDir} isOpen={open} />
        <span className="font-mono truncate">{node.name}</span>
      </div>
      {isDir && (
        <AnimatePresence>
          {open && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map((child, i) => (
                <TreeNode key={child.name} node={child} depth={depth + 1} onToggle={onToggle} revealed={revealed + 1 + i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function LiveFileTree() {
  const [root, setRoot] = useState(DEMO_TREE);
  const [revealed, setRevealed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRevealed((r) => {
        if (r >= countNodes(root)) {
          clearInterval(intervalRef.current);
          return r;
        }
        return r + 1;
      });
    }, 120);
    return () => clearInterval(intervalRef.current);
  }, []);

  function countNodes(node) {
    let count = 1;
    if (node.children) for (const c of node.children) count += countNodes(c);
    return count;
  }

  const handleToggle = (name) => {};

  return (
    <div className="w-full max-h-[450px] overflow-y-auto bg-void/60 border border-rift rounded-lg p-4 font-mono text-xs scrollbar-thin shadow-xl">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-rift/50 text-[10px] uppercase tracking-wider font-bold text-comet/60">
        <div className="w-2 h-2 rounded-full bg-nova animate-pulse" />
        <span>explorer — live</span>
        <span className="ml-auto text-stardust/30">{revealed}/{countNodes(root)} files</span>
      </div>
      <TreeNode
        node={root}
        depth={0}
        onToggle={handleToggle}
        revealed={0}
      />
    </div>
  );
}
