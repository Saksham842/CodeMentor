import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "./Button";

export function CodeBlock({ code, language = "typescript", showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative border border-rift rounded-lg overflow-hidden bg-void font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-cavern border-b border-rift text-xs font-semibold text-comet uppercase">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="p-1 hover:bg-rift text-stardust hover:text-white"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-nova mr-1" />
          ) : (
            <Copy className="w-3.5 h-3.5 mr-1" />
          )}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>

      <div className="max-h-[450px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.85rem",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-mono)",
            },
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
