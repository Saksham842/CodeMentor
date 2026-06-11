import { cn } from "@/lib/utils";
import { FileCitation } from "./FileCitation";
import { CodeBlock } from "../ui/CodeBlock";
import { Bot, User } from "lucide-react";

export function ChatMessage({ message, onCitationClick }) {
  const isUser = message.role === "user";

  const renderContent = (content) => {
    const parts = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const textBefore = content.substring(lastIndex, match.index);
      const language = match[1] || "typescript";
      const code = match[2];

      if (textBefore.trim()) {
        parts.push(
          <p key={`text-${lastIndex}`} className="leading-relaxed whitespace-pre-wrap mb-4 text-sm text-stardust">
            {textBefore}
          </p>
        );
      }

      parts.push(
        <div key={`code-${match.index}`} className="mb-4">
          <CodeBlock code={code} language={language} showLineNumbers />
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <p key={`text-${lastIndex}`} className="leading-relaxed whitespace-pre-wrap mb-4 text-sm text-stardust">
            {remainingText}
          </p>
        );
      }
    }

    return parts.length > 0 ? parts : <p className="text-sm">{content}</p>;
  };

  return (
    <div className={cn("flex w-full gap-4 py-4 px-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-cavern border border-rift flex items-center justify-center text-nebula shadow-md shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-xl px-4 py-3 text-sm transition-all",
          isUser
            ? "bg-gradient-to-br from-aurora to-nebula text-white rounded-tr-none shadow-[0_4px_15px_rgba(99,102,241,0.15)]"
            : "bg-cavern border border-rift border-l-4 border-l-nebula rounded-tl-none"
        )}
      >
        <div className="space-y-1">
          {isUser ? <p className="leading-relaxed">{message.content}</p> : renderContent(message.content)}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 border-t border-rift pt-3">
            <span className="block text-[10px] uppercase font-bold text-comet tracking-wider mb-2">
              📜 Document References
            </span>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((cite) => (
                <FileCitation key={cite} filePath={cite} onClick={onCitationClick} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nebula to-cosmic flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
          U
        </div>
      )}
    </div>
  );
}
