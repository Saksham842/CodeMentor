import { useState } from "react";
import { useProject } from "@/hooks/useProject";
import { Button } from "../ui/Button";
import { CodeBlock } from "../ui/CodeBlock";
import { SlideOver } from "../ui/SlideOver";
import { Sparkles, RefreshCw, FileCode2 } from "lucide-react";
import { showToast } from "../ui/Toast";

function findInTree(node, targetPath) {
  if (node.path === targetPath) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findInTree(child, targetPath);
      if (found) return found;
    }
  }
  return null;
}

export function FileDetail({ filePath }) {
  const { project } = useProject();
  const [showAIExplainer, setShowAIExplainer] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [loadingExplainer, setLoadingExplainer] = useState(false);

  const fileNode = project?.fileTree ? findInTree(project.fileTree, filePath) : null;
  const fileExt = filePath.split(".").pop();
  const fileName = filePath.split("/").pop();

  const fileContent = project?.fileContents?.[filePath];

  const handleAIExplain = async () => {
    setLoadingExplainer(true);
    setShowAIExplainer(true);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain the contents and purpose of the file "${filePath}" in this project.\nProject: ${project?.name || "unknown"}\nTech stack: ${Object.values(project?.stack || {}).flat().join(", ") || "unknown"}${fileContent ? `\n\nFile content:\n${fileContent.slice(0, 3000)}` : ""}`,
          projectContext: { name: project?.name, stack: project?.stack, stats: project?.stats },
        })
      });
      if (!res.ok) throw new Error("Grok service connection failure.");
      const data = await res.json();
      setAiContent(data.result);
    } catch (err) {
      showToast.error("Failed to fetch AI explanation: " + err.message);
      setAiContent("Failed to load AI response. Check your GROQ_API_KEY.");
    } finally {
      setLoadingExplainer(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-rift pb-4">
        <div className="flex items-center gap-3">
          <FileCode2 className="w-6 h-6 text-nebula" />
          <div>
            <h2 className="text-xl font-display font-bold text-white">{fileName}</h2>
            <span className="text-xs font-mono text-comet">{filePath}</span>
          </div>
        </div>
        <Button
          onClick={handleAIExplain}
          className="flex items-center gap-1.5 shadow-md"
          size="sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explain with AI</span>
        </Button>
      </div>

      {fileNode && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-cavern/40 border border-rift p-3 text-center">
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-comet mb-1">Type</p>
            <p className="text-sm font-mono text-white">{fileNode.type}</p>
          </div>
          <div className="rounded-lg bg-cavern/40 border border-rift p-3 text-center">
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-comet mb-1">Extension</p>
            <p className="text-sm font-mono text-white">.{fileExt}</p>
          </div>
          {fileNode.size && (
            <div className="rounded-lg bg-cavern/40 border border-rift p-3 text-center">
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-comet mb-1">Size</p>
              <p className="text-sm font-mono text-white">{fileNode.size} chars</p>
            </div>
          )}
          <div className="rounded-lg bg-cavern/40 border border-rift p-3 text-center">
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-comet mb-1">Language</p>
            <p className="text-sm font-mono text-white">{fileNode.language || "text"}</p>
          </div>
        </div>
      )}

      {fileContent ? (
        <div className="space-y-2">
          <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white">
            💻 Source Code
          </h3>
          <CodeBlock code={fileContent} language={fileExt} showLineNumbers />
        </div>
      ) : (
        <div className="rounded-lg bg-cavern/20 border border-dashed border-rift p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-nebula/50 mx-auto" />
          <p className="text-sm text-stardust/60">
            {fileNode ? "File content is only available in the current session." : "Select a file from the tree to see its details."} Use the AI explainer below.
          </p>
          <Button onClick={handleAIExplain} variant="secondary" size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Explain with Grok
          </Button>
        </div>
      )}

      <SlideOver
        isOpen={showAIExplainer}
        onClose={() => setShowAIExplainer(false)}
        title={`AI Explainer: ${fileName}`}
      >
        {loadingExplainer ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
            <RefreshCw className="w-8 h-8 text-nebula animate-spin" />
            <p className="text-sm font-mono text-gradient-aurora">Decoding codebase scrolls...</p>
          </div>
        ) : (
          <div className="space-y-4 text-stardust leading-relaxed">
            {aiContent.split("\n\n").map((chunk, index) => {
              if (chunk.includes("```")) {
                const code = chunk.replace(/```\w*|```/g, "").trim();
                return <CodeBlock key={index} code={code} language={fileExt} />;
              }
              return <p key={index} className="text-sm">{chunk}</p>;
            })}
          </div>
        )}
      </SlideOver>
    </div>
  );
}
