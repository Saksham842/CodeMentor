import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useProject } from "@/hooks/useProject";
import { FolderUp, Link2 } from "lucide-react";
import { showToast } from "../ui/Toast";
import { parseRepository } from "@/lib/projectParser";

export function UploadModal({ isOpen, onClose }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { startAnalysis, updateProgress, completeAnalysis } = useProject();

  const handleAnalysisSequence = async (repoName, parsePromise) => {
    onClose();
    startAnalysis("📡 Establishing connection to the repository...");

    const messages = [
      { p: 15, m: "🗂️ Mapping the ancient scrolls..." },
      { p: 30, m: "🔍 Decoding languages and frameworks..." },
      { p: 48, m: "🕸️ Weaving the dependency tapestry..." },
      { p: 65, m: "🛡️ Scanning for shadows and vulnerabilities..." },
      { p: 80, m: "📊 Calculating the weight of complexity..." },
      { p: 92, m: "🧠 Forging the knowledge base..." },
      { p: 100, m: "✨ The Oracle is ready. Your quest begins." }
    ];

    try {
      const parseTask = parsePromise();

      for (let i = 0; i < messages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        updateProgress(messages[i].p, messages[i].m);
      }

      const resultProject = await parseTask;
      completeAnalysis(resultProject);
      showToast.success(`Quest Loaded: ${repoName} is ready!`);
    } catch (err) {
      completeAnalysis(null);
      showToast.error("Failed to decode codebase: " + err.message);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (!file.name.endsWith(".zip")) {
      showToast.error("Please drop a ZIP archive file.");
      return;
    }

    handleAnalysisSequence(file.name.replace(".zip", ""), () =>
      parseRepository({ file })
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "application/zip": [".zip"] }
  });

  const handleGithubAnalyze = async (e) => {
    e.preventDefault();
    if (!githubUrl) {
      showToast.error("Please insert a GitHub Repository URL");
      return;
    }
    if (!githubUrl.includes("github.com/")) {
      showToast.error("Invalid URL: must be a github.com link");
      return;
    }

    const repoName = githubUrl.split("/").pop() || "Repository";
    handleAnalysisSequence(repoName, () =>
      parseRepository({ githubUrl })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Begin The Quest">
      <div className="space-y-6 py-2">
        <p className="text-xs text-stardust/80">
          Upload any repository archive or hook up a public GitHub reference. CodeMentor AI will analyze its architecture, detect vulnerabilities, and map its timeline.
        </p>

        <div
          {...getRootProps()}
          className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer text-center transition-all ${
            isDragActive
              ? "border-nebula bg-nebula/10 scale-102"
              : "border-rift bg-void/30 hover:border-nebula/40 hover:bg-rift/10"
          }`}
        >
          <input {...getInputProps()} />
          <FolderUp
            className={`w-10 h-10 mb-3 transition-transform group-hover:-translate-y-1 ${
              isDragActive ? "text-nebula animate-bounce" : "text-comet group-hover:text-nebula"
            }`}
          />
          <p className="text-sm font-semibold text-white">
            {isDragActive ? "Drop the scrolls here..." : "Drop repository ZIP here or browse"}
          </p>
          <span className="text-[10px] text-stardust/40 mt-1 uppercase font-semibold">
            ZIP packages up to 50MB
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-comet uppercase">
          <div className="flex-1 h-px bg-rift" />
          <span>OR</span>
          <div className="flex-1 h-px bg-rift" />
        </div>

        <form onSubmit={handleGithubAnalyze} className="space-y-4">
          <Input
            label="Git Repository Link"
            type="url"
            placeholder="https://github.com/username/project"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="font-mono text-xs"
          />

          <Button
            type="submit"
            className="w-full flex items-center gap-2"
            isLoading={loading}
          >
            <Link2 className="w-4 h-4" />
            <span>Analyze Repository</span>
          </Button>
        </form>
      </div>
    </Modal>
  );
}
