import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { showToast } from "../ui/Toast";
import { Sparkles, Terminal } from "lucide-react";

export function ChatInterface({ systemPrompt, projectName, projectContext, onCitationClick }) {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChat();
  const [tokensUsed, setTokensUsed] = useState(0);
  const scrollRef = useRef(null);

  const suggestionChips = [
    "Tell me about this project",
    "What are the main architectural decisions?",
    "Find potential security issues",
    "Explain the database schema",
    "Show me the key entry points"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: "welcome-1",
        role: "assistant",
        content: `Greetings, Traveler. I am the Oracle of CodeMentor AI. I have decoded the scrolls of the **${projectName || "this project"}** repository.
Ask me about the architecture, security flows, or database constraints. Your quest awaits!`,
        timestamp: new Date().toLocaleTimeString(),
        citations: []
      });
    }
  }, [messages, addMessage]);

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      const formattedHistory = messages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      formattedHistory.push({ role: "user", content: text });

      const res = await fetch("/api/grok/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
          systemPrompt,
          projectContext
        })
      });

      if (!res.ok) throw new Error("Grok service connection lost.");
      const data = await res.json();

      const citations = [];

      addMessage({
        id: Math.random().toString(),
        role: "assistant",
        content: data.result,
        timestamp: new Date().toLocaleTimeString(),
        citations
      });

      setTokensUsed((prev) => prev + Math.floor(data.result.length / 4) + 15);
    } catch (err) {
      showToast.error("API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-rift rounded-xl bg-cavern/40 overflow-hidden glass-panel">
      <div className="flex items-center justify-between px-6 py-3 border-b border-rift bg-void/30 text-xs">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Terminal className="w-4 h-4 text-nebula" />
          <span className="uppercase tracking-wider">Oracle Connection</span>
        </div>
        <div className="flex items-center gap-4 text-comet font-mono">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cosmic" />
            <span>Tokens: {tokensUsed}</span>
          </span>
          <button
            onClick={clearMessages}
            className="hover:text-white transition-colors"
          >
            Clear Scrolls
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-thin">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onCitationClick={onCitationClick} />
        ))}

        {isLoading && (
          <div className="flex gap-4 py-4 px-2 items-center">
            <div className="w-8 h-8 rounded-full bg-cavern border border-rift flex items-center justify-center text-nebula shadow-md">
              🧠
            </div>
            <div className="bg-cavern border border-rift border-l-4 border-l-nebula rounded-xl rounded-tl-none px-5 py-3.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-nebula animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-nebula animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-nebula animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-void/20 border-t border-rift space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full border border-rift bg-cavern text-xs text-stardust hover:text-white hover:border-nebula/40 transition-all shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
