import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { useGrok } from "@/hooks/useGrok";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";
import { Search, Sparkles } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export default function SearchPage() {
  const { project } = useProject();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { execute, loading } = useGrok("/api/grok/search");

  const chips = [
    "user authentication",
    "payment processing",
    "error handling",
    "caching logic",
    "database queries"
  ];

  const handleSearch = async (val) => {
    if (!val.trim()) return;
    setQuery(val);
    try {
      const apiResult = await execute({ query: val, projectContext: buildContextString(project) });
      if (Array.isArray(apiResult)) {
        setResults(apiResult);
      } else {
        setResults([
          {
            file: "src/lib/auth.ts",
            lineRange: "15-30",
            relevance: 85,
            preview: `// Mock match for query: ${val}`,
            reason: "Mock result details returned."
          }
        ]);
      }
      showToast.success("Oracle search completed!");
    } catch {
      showToast.error("Failed to execute code search.");
    }
  };

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter V" title="The Seeking Glass" />

      <div className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex gap-3 max-w-3xl mx-auto"
        >
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="Query database queries, auth, caching locks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-12 text-sm py-3 font-semibold shadow-inner focus:shadow-[0_0_20px_rgba(124,58,237,0.2)] focus:border-nebula"
            />
            <Search className="w-5 h-5 text-stardust/40 absolute right-4 top-3.5" />
          </div>
          <Button
            type="submit"
            isLoading={loading}
            className="px-6 flex items-center gap-1.5 uppercase tracking-wider text-xs font-bold shrink-0 cursor-pointer shadow-lg"
          >
            <span>Scan</span>
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 justify-center py-1 max-w-3xl mx-auto select-none">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => handleSearch(c)}
              className="px-3.5 py-1.5 rounded-full border border-rift bg-cavern/40 text-xs text-stardust hover:text-white hover:border-nebula/40 transition-all cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto pt-4 space-y-6">
          <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white select-none">
            🔍 Decoded Matches ({results.length})
          </h3>

          <StaggerReveal className="space-y-4">
            {results.map((res, i) => (
              <Card key={i} glow className="p-5 space-y-4 bg-cavern/30 border-rift">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-rift pb-3">
                  <div className="space-y-1">
                    <span className="block text-xs font-mono font-bold text-white">
                      {res.file}
                    </span>
                    <span className="block text-[10px] font-mono text-comet uppercase leading-none">
                      Lines {res.lineRange}
                    </span>
                  </div>
                  <div className="w-44 shrink-0 select-none">
                    <ScoreBar label="Relevance Match" value={res.relevance} colorClass="bg-nebula" />
                  </div>
                </div>

                <p className="text-xs text-stardust leading-relaxed">
                  {res.reason}
                </p>

                <CodeBlock code={res.preview} language="typescript" showLineNumbers={false} />
              </Card>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </PageWrapper>
  );
}
