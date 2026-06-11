import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { MessageSquare, Shield, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function InterviewChat({
  personaName,
  personaRole,
  history,
  onAnswer,
  isLoading
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onAnswer(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-[520px] border border-rift rounded-xl bg-cavern/40 overflow-hidden glass-panel">
      <div className="flex items-center justify-between px-6 py-3 border-b border-rift bg-void/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nebula to-aurora flex items-center justify-center font-display font-bold text-white text-xs shadow-md">
            {personaName.charAt(0)}
          </div>
          <div>
            <span className="block text-xs font-bold text-white leading-none">{personaName}</span>
            <span className="text-[10px] text-comet font-mono uppercase tracking-wider">{personaRole}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-comet tracking-widest font-mono">
          <Terminal className="w-4 h-4 text-nebula" />
          <span>Chamber Link Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
        {history.map((msg, idx) => {
          const isCand = msg.sender === "candidate";
          return (
            <div key={idx} className={cn("flex w-full gap-3", isCand ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                  isCand
                    ? "bg-gradient-to-r from-aurora to-nebula text-white rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.15)]"
                    : "bg-void border border-rift rounded-tl-none text-stardust"
                )}
              >
                {!isCand && msg.text.includes("\n") ? (
                  <div className="space-y-3">
                    {msg.text.split("\n").map((chunk, i) => (
                      <p key={i} className={i === 0 ? "font-semibold text-white" : "italic text-comet pl-3 border-l border-nebula"}>
                        {chunk}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-6 h-6 rounded-full bg-void border border-rift flex items-center justify-center animate-pulse" />
            <div className="bg-void border border-rift rounded-xl px-4 py-2 text-xs font-mono text-gradient-aurora">
              Interviewer is evaluating your response...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-rift bg-void/20 flex gap-3 items-end">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder="Defend your architectural choices here. Reference patterns like singletons, Redis caches, or signature checks..."
          className="flex-1 resize-none bg-void/50 border border-rift rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nebula focus:ring-1 focus:ring-nebula focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] disabled:opacity-50 scrollbar-none"
        />
        
        <Button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex items-center gap-1.5 h-10 px-5 shadow-md shrink-0 cursor-pointer"
          size="sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Defense</span>
        </Button>
      </form>
    </div>
  );
}

export default InterviewChat;
