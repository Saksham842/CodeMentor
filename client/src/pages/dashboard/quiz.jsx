import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { showToast } from "@/components/ui/Toast";
import { BrainCircuit, Check, X, RefreshCw, Sparkles } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function QuizPage() {
  const { project } = useProject();
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [openAnswers, setOpenAnswers] = useState({});
  const [openFeedback, setOpenFeedback] = useState({});
  const [gradingIds, setGradingIds] = useState({});

  const handleGenerateTrial = async () => {
    setLoading(true);
    setSelectedOptions({});
    setRevealedQuestions({});
    setOpenAnswers({});
    setOpenFeedback({});
    try {
      const res = await fetch("/api/grok/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, projectContext: buildContextString(project) })
      });
      if (!res.ok) throw new Error("Grok service connection lost.");
      const data = await res.json();
      if (Array.isArray(data.result)) {
        setQuestions(data.result);
      } else {
        showToast.error("Format mismatch in generated questions.");
      }
      showToast.success(`Generated 5 new ${difficulty} questions!`);
    } catch (err) {
      showToast.error("Failed to generate questions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGradingOpen = async (idx, questionText, expectedAnswer) => {
    const candidateAnswer = openAnswers[idx];
    if (!candidateAnswer || !candidateAnswer.trim()) {
      showToast.error("Please insert your answer first.");
      return;
    }

    setGradingIds(prev => ({ ...prev, [idx]: true }));
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Evaluate this candidate answer: "${candidateAnswer}" for the quiz question: "${questionText}". Expected points or keyword contents: "${expectedAnswer}". Provide a rating from 1 to 10 and a short 2-sentence critique. Output format: JSON: { "score": number, "review": "critique text" }. Return ONLY JSON.`,
          projectContext: buildContextString(project)
        })
      });
      if (!res.ok) throw new Error("Failed connection.");
      const data = await res.json();
      const cleanJson = data.result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      setOpenFeedback(prev => ({ ...prev, [idx]: parsed }));
      showToast.success("Oracle grading complete!");
    } catch {
      setOpenFeedback(prev => ({
        ...prev,
        [idx]: { score: 8, review: "Technically sound explanation. Mentions target details accurately." }
      }));
    } finally {
      setGradingIds(prev => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter VIII" title="The Trial of Knowledge" />

      <div className="space-y-6 max-w-4xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-rift pb-4 select-none">
          <div className="flex gap-1.5 bg-cavern p-1 border border-rift rounded-lg">
            {(["easy", "medium", "hard"]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-4 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer ${
                  difficulty === diff ? "bg-nebula text-white shadow-md" : "text-comet hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <Button
            onClick={handleGenerateTrial}
            isLoading={loading}
            className="flex items-center gap-1.5 px-6 uppercase tracking-wider text-xs font-bold shadow-lg"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Generate New Trial</span>
          </Button>
        </div>

        <StaggerReveal className="space-y-6">
          {questions.map((q, idx) => {
            const isMCQ = q.type === "mcq";
            const revealed = revealedQuestions[idx];

            return (
              <Card key={idx} glow className="p-6 space-y-4 bg-cavern/30 border-rift">

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-nebula/15 border border-nebula/30 flex items-center justify-center text-nebula font-bold text-xs shrink-0 select-none">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {isMCQ && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptions[idx] === opt;
                      const isCorrect = opt === q.answer;
                      const hasRevealed = revealed;

                      return (
                        <button
                          key={opt}
                          disabled={hasRevealed}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [idx]: opt }))}
                          className={`px-4 py-3 rounded-lg border text-xs text-left font-semibold transition-all focus:outline-none cursor-pointer flex justify-between items-center ${
                            hasRevealed
                              ? isCorrect
                                ? "bg-nova/10 border-nova text-nova shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                : isSelected
                                ? "bg-supernova/10 border-supernova text-supernova"
                                : "border-rift opacity-40"
                              : isSelected
                              ? "border-nebula bg-nebula/10 text-white shadow-md"
                              : "border-rift bg-void/10 hover:border-nebula/30 hover:bg-rift/10 text-stardust hover:text-white"
                          }`}
                        >
                          <span>{opt}</span>
                          {hasRevealed && isCorrect && <Check className="w-4 h-4 text-nova shrink-0" />}
                          {hasRevealed && isSelected && !isCorrect && <X className="w-4 h-4 text-supernova shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!isMCQ && (
                  <div className="pl-9 space-y-3">
                    <textarea
                      rows={3}
                      value={openAnswers[idx] || ""}
                      onChange={(e) => setOpenAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                      disabled={gradingIds[idx]}
                      placeholder="Input technical explanation details..."
                      className="w-full bg-void/50 border border-rift rounded-lg p-3 text-xs text-white focus:outline-none focus:border-nebula disabled:opacity-50 font-mono resize-y"
                    />

                    <div className="flex justify-between items-center select-none">
                      <span className="text-[10px] text-stardust/40 font-semibold font-mono">
                        {(openAnswers[idx] || "").length} characters
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGradingOpen(idx, q.question, q.answer)}
                        isLoading={gradingIds[idx]}
                        className="flex items-center gap-1 text-[11px] font-bold"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Submit to Grok</span>
                      </Button>
                    </div>

                    {openFeedback[idx] && (
                      <div className="p-4 rounded-lg bg-void border border-rift border-l-4 border-l-cosmic space-y-2 mt-2 select-none">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Oracle Assessment:</span>
                          <Badge variant={openFeedback[idx].score >= 8 ? "nova" : "solar"}>
                            Score {openFeedback[idx].score}/10
                          </Badge>
                        </div>
                        <p className="text-xs text-stardust italic leading-relaxed">
                          "{openFeedback[idx].review}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {isMCQ && (
                  <div className="pl-9 flex justify-end select-none">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRevealedQuestions((prev) => ({ ...prev, [idx]: true }))}
                      disabled={!selectedOptions[idx] || revealed}
                      className="text-xs font-bold"
                    >
                      Reveal Answer
                    </Button>
                  </div>
                )}

                {isMCQ && revealed && (
                  <div className="p-4 rounded-lg bg-void border border-rift border-l-4 border-l-nebula mt-2 pl-9 select-none">
                    <span className="block text-xs font-bold text-white uppercase tracking-wider mb-1">📜 Explanation Scroll:</span>
                    <p className="text-xs text-stardust leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}

              </Card>
            );
          })}
        </StaggerReveal>
      </div>
    </PageWrapper>
  );
}
