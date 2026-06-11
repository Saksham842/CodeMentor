import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Shield, Trophy } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import IntensityMeter from "@/components/interview/IntensityMeter";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";

export default function DefensePage() {
  const { project } = useProject();
  const [intensity, setIntensity] = useState(1);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I've reviewed your codebase in its entirety. Let us begin. Tell me — why did you choose a monolithic architecture for NexaCommerce instead of microservices? And don't give me a textbook answer.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const newExchangeCount = exchangeCount + 1;
    setExchangeCount(newExchangeCount);

    if (newExchangeCount % 2 === 0 && intensity < 10) {
      setIntensity((prev) => Math.min(10, prev + 1));
    }

    try {
      const res = await fetch("/api/grok/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: "defense",
          intensity,
          projectName: project?.name ?? "NexaCommerce",
        }),
      });

      const data = await res.json();
      const reply = data.reply ?? "The Council considers your answer...";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: Date.now() },
      ]);
    } catch {
      showToast.error("The Council is momentarily silent.");
    } finally {
      setLoading(false);
    }
  };

  const handleYield = () => {
    setShowVictory(true);
    setConfetti(true);
  };

  const getIntensityColor = () => {
    if (intensity <= 3) return "border-aurora-500/20 bg-aurora-500/5";
    if (intensity <= 6) return "border-solar-500/20 bg-solar-500/5";
    if (intensity <= 8) return "border-supernova-500/20 bg-supernova-500/5";
    return "border-nova-500/30 bg-nova-500/10";
  };

  return (
    <PageWrapper>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(220,38,38,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <SectionHeader
        chapter="Chapter XI"
        title="The Final Trial"
        subtitle="Face the most relentless inquisitor in the realm. Every answer invites a sharper question. Your knowledge is the only shield."
        icon={<Flame className="w-6 h-6 text-nova-400" />}
      />

      <div className="mb-6">
        <IntensityMeter intensity={intensity} onChangeIntensity={setIntensity} />
      </div>

      <div
        className={cn(
          "rounded-2xl border backdrop-blur-sm flex flex-col h-[60vh] transition-all duration-700",
          getIntensityColor()
        )}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-vault-600 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-nebula-600/40 border border-nebula-500/30 text-stardust-100"
                      : intensity >= 8
                      ? "bg-nova-900/40 border border-nova-500/30 text-nova-100"
                      : "bg-vault-700/40 border border-vault-600/30 text-stardust-200"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Flame
                        className={cn(
                          "w-4 h-4",
                          intensity >= 8
                            ? "text-nova-400 animate-pulse"
                            : "text-supernova-400"
                        )}
                      />
                      <span className="text-xs font-mono text-stardust-400">
                        The Inquisitor · Intensity {intensity}/10
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-vault-700/40 border border-vault-600/30 rounded-xl px-4 py-3">
                <Spinner size="sm" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-vault-600/30 p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Defend your choices... (Enter to send)"
            rows={2}
            className={cn(
              "flex-1 resize-none rounded-lg px-4 py-3 text-sm bg-void-950/60 border text-stardust-100",
              "placeholder:text-stardust-500 focus:outline-none focus:ring-2 transition-all",
              intensity >= 8
                ? "border-nova-500/40 focus:ring-nova-500/30"
                : "border-vault-600/50 focus:ring-nebula-500/30"
            )}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={intensity >= 8 ? "!bg-nova-600 hover:!bg-nova-500" : ""}
          >
            Defend
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="ghost" size="lg" onClick={handleYield} className="text-stardust-400 hover:text-nova-300">
          🏳️ I yield to the Council
        </Button>
      </div>

      <Modal
        open={showVictory}
        onClose={() => setShowVictory(false)}
        title="The Trial Is Complete"
      >
        <div className="text-center space-y-6 py-4">
          {confetti && (
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <Trophy className="w-20 h-20 text-solar-400" />
              </motion.div>
            </div>
          )}

          <div>
            <h3 className="text-2xl font-display font-bold text-stardust-100 mb-2">
              The Council Is Satisfied
            </h3>
            <p className="text-stardust-400">
              You have faced {exchangeCount} questions at intensity level{" "}
              <span className="text-solar-400 font-bold">{intensity}/10</span>.
              Your legend grows stronger.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Exchanges", value: exchangeCount, color: "text-nebula-400" },
              { label: "Max Intensity", value: `${intensity}/10`, color: "text-nova-400" },
              { label: "Rank", value: intensity >= 8 ? "Master" : intensity >= 5 ? "Adept" : "Initiate", color: "text-solar-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-vault-700/30 rounded-xl p-3 border border-vault-600/30">
                <div className={cn("text-2xl font-bold font-display", stat.color)}>{stat.value}</div>
                <div className="text-xs text-stardust-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setShowVictory(false)}>
              Return to Chamber
            </Button>
            <Button variant="primary" onClick={() => window.location.href = "/dashboard/gaps"}>
              <Shield className="w-4 h-4 mr-2" /> Reveal Your Gaps
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
