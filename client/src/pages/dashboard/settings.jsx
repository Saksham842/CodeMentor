import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const PERSONAS = [
  { id: "hiring-veteran", label: "Hiring Veteran", desc: "Focused on past experience and team fit" },
  { id: "engineering-royalty", label: "Engineering Royalty", desc: "Deep technical systems questions" },
  { id: "master-builder", label: "Master Builder", desc: "Architecture and design patterns" },
  { id: "technical-court", label: "Technical Court", desc: "Panel with mixed specialties" },
];

const EXPORT_FORMATS = [
  { id: "markdown", label: "Markdown (.md)" },
  { id: "json", label: "JSON (.json)" },
  { id: "pdf", label: "PDF (browser print)" },
];

export default function SettingsPage() {
  const { project } = useProject();
  const [temperature, setTemperature] = useLocalStorage("grok_temperature", 0.7);
  const [maxTokens, setMaxTokens] = useLocalStorage("grok_max_tokens", 2048);
  const [defaultPersona, setDefaultPersona] = useLocalStorage("default_persona", "hiring-veteran");
  const [exportFormat, setExportFormat] = useLocalStorage("export_format", "markdown");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    showToast.success("Settings saved to the Codex!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="The Codex"
        title="Settings"
        subtitle="Configure the arcane parameters of your AI mentor. Every setting shapes the quality of your counsel."
        icon={<Settings className="w-6 h-6 text-stardust-400" />}
      />

      <StaggerReveal className="space-y-8">
        <Card glow className="p-6">
          <h3 className="text-base font-display font-semibold text-stardust-100 mb-1">
            AI Configuration
          </h3>
          <p className="text-sm text-stardust-400 mb-6">
            Configure the Grok model parameters used across all AI features.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-void-950/60 border border-vault-600/30">
              <div>
                <p className="text-sm font-medium text-stardust-200">Active Model</p>
                <p className="text-xs text-stardust-500 mt-0.5">
                  Server-side via GROQ_API_KEY environment variable
                </p>
              </div>
              <Badge variant="nebula">llama-3.3-70b-versatile</Badge>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-stardust-200">Temperature</p>
                  <p className="text-xs text-stardust-500">
                    Controls creativity — lower = focused, higher = creative
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-nebula-400">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-vault-700 accent-nebula-500 cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-stardust-500">0.0 — Precise</span>
                <span className="text-xs text-stardust-500">1.0 — Creative</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-stardust-200">Max Tokens</p>
                  <p className="text-xs text-stardust-500">
                    Maximum response length. Higher = more detail, more cost.
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-nebula-400">{maxTokens}</span>
              </div>
              <input
                type="range"
                min={256}
                max={4096}
                step={256}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-vault-700 accent-nebula-500 cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-stardust-500">256</span>
                <span className="text-xs text-stardust-500">4096</span>
              </div>
            </div>
          </div>
        </Card>

        <Card glow className="p-6">
          <h3 className="text-base font-display font-semibold text-stardust-100 mb-1">
            Project
          </h3>
          <p className="text-sm text-stardust-400 mb-6">
            The active project loaded into CodeMentor AI.
          </p>

          <div className="p-4 rounded-xl bg-void-950/60 border border-vault-600/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stardust-200">{project?.name || "NexaCommerce"}</p>
              <p className="text-xs text-stardust-500 mt-0.5">
                {project?.tagline || "Multi-vendor e-commerce platform"} · {project?.stats?.loc?.toLocaleString() || "4,721"} lines · {project?.stats?.files || 47} files
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="aurora">Active</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("upload-trigger")?.click()}
              >
                Change
              </Button>
            </div>
          </div>
        </Card>

        <Card glow className="p-6">
          <h3 className="text-base font-display font-semibold text-stardust-100 mb-1">
            Preferences
          </h3>
          <p className="text-sm text-stardust-400 mb-6">
            Personalise your CodeMentor AI experience.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-stardust-200 mb-3">Default Interview Persona</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setDefaultPersona(persona.id)}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all",
                      defaultPersona === persona.id
                        ? "border-nebula-500/50 bg-nebula-500/10"
                        : "border-vault-600/30 hover:border-vault-500/50"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-medium",
                        defaultPersona === persona.id
                          ? "text-nebula-300"
                          : "text-stardust-200"
                      )}
                    >
                      {persona.label}
                    </p>
                    <p className="text-xs text-stardust-500 mt-0.5">{persona.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-stardust-200 mb-3">Default Export Format</p>
              <div className="flex gap-3">
                {EXPORT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm transition-all",
                      exportFormat === fmt.id
                        ? "border-nebula-500/50 bg-nebula-500/10 text-nebula-300"
                        : "border-vault-600/30 text-stardust-400 hover:text-stardust-200"
                    )}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-stardust-200 mb-2">Theme</p>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg border border-nebula-500/50 bg-nebula-500/10 text-nebula-300 text-sm">
                  🌌 Dark Cosmic (Default)
                </div>
                <Badge variant="comet">Only Theme</Badge>
              </div>
              <p className="text-xs text-stardust-500 mt-2">
                The cosmic dark theme is the one true path. Light mode is not on the roadmap.
              </p>
            </div>
          </div>
        </Card>

        <Card glow className="p-6 border-nebula-500/20 bg-nebula-500/5">
          <h3 className="text-base font-display font-semibold text-stardust-100 mb-4">
            About CodeMentor AI
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Model", value: "grok-3-mini" },
              { label: "Pages", value: "20" },
              { label: "Built with", value: "Next.js 15" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-void-950/40 p-3 border border-vault-600/20">
                <p className="text-xs text-stardust-500 mb-1">{item.label}</p>
                <p className="text-sm font-mono font-bold text-nebula-300">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              icon={<Save className="w-5 h-5" />}
              className={saved ? "!bg-aurora-600" : ""}
            >
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </motion.div>
        </div>
      </StaggerReveal>
    </PageWrapper>
  );
}
