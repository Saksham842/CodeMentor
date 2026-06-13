import { useState, useRef } from "react";
import { Send, CornerDownLeft } from "lucide-react";
import { Button } from "../ui/Button";

export function ChatInput({ onSend, isLoading, placeholder = "Ask the Oracle anything about the codebase..." }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative border border-rift rounded-xl bg-void/50 focus-within:border-nebula/60 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all">
      <textarea
        ref={inputRef}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-sm text-white placeholder-stardust/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-none"
      />
      
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-stardust/30 mr-1 select-none">
          <span>Enter</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </span>
        
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="p-2 rounded-lg bg-gradient-to-r from-nebula to-aurora text-white shadow-md cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
