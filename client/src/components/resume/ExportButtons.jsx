import { useState } from "react";
import { Button } from "../ui/Button";
import { Copy, Download, Check } from "lucide-react";
import { showToast } from "../ui/Toast";

export function ExportButtons({ bullets }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = bullets.map((b, i) => `- ${b}`).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast.success("All bullets copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const text = `# NexaCommerce Experience Bullets\n\n${bullets.map((b) => `- ${b}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexacommerce_experience.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast.success("Downloaded experience bullets as Markdown!");
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={handleCopy}
        className="flex items-center gap-1.5 cursor-pointer"
        size="sm"
      >
        {copied ? <Check className="w-4 h-4 text-nova" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? "Copied" : "Copy All"}</span>
      </Button>

      <Button
        variant="primary"
        onClick={handleDownload}
        className="flex items-center gap-1.5 cursor-pointer"
        size="sm"
      >
        <Download className="w-4 h-4" />
        <span>Export Markdown</span>
      </Button>
    </div>
  );
}

export default ExportButtons;
