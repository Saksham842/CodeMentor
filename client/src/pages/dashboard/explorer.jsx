import { useSearchParams } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { useProject } from "@/hooks/useProject";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FileTree } from "@/components/explorer/FileTree";
import { FileDetail } from "@/components/explorer/FileDetail";
import { Card } from "@/components/ui/Card";

function ExplorerContent() {
  const { project } = useProject();
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");

  const [selectedFile, setSelectedFile] = useState("src/lib/auth.ts");

  useEffect(() => {
    if (fileParam) {
      setSelectedFile(fileParam);
    }
  }, [fileParam]);

  const rootNode = project?.fileTree || {
    name: project?.name || "Project",
    path: "root",
    type: "directory",
    children: []
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <Card glow className="p-4 lg:col-span-1 h-[600px] overflow-y-auto bg-cavern/30 border-rift scrollbar-thin">
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-3 pb-2 border-b border-rift">
          📁 Scroll Directories
        </h3>
        <FileTree
          node={rootNode}
          selectedPath={selectedFile}
          onSelect={(path) => setSelectedFile(path)}
        />
      </Card>

      <Card glow className="p-6 lg:col-span-2 h-[600px] overflow-y-auto bg-cavern/30 border-rift scrollbar-thin">
        <FileDetail filePath={selectedFile} />
      </Card>

    </div>
  );
}

export default function ExplorerPage() {
  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter III" title="The Ancient Scrolls" />
      <Suspense fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-sm font-mono text-gradient-aurora">Loading explorer scrolls...</p>
        </div>
      }>
        <ExplorerContent />
      </Suspense>
    </PageWrapper>
  );
}
