import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import PersonaSelector from "@/components/interview/PersonaSelector";
import InterviewChat from "@/components/interview/InterviewChat";
import { Button } from "@/components/ui/Button";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function InterviewPage() {
  const navigate = useNavigate();
  const { project } = useProject();
  const [selectedPersona, setSelectedPersona] = useState("hiring-veteran");
  const [selectedCategories, setSelectedCategories] = useState([
    "architecture",
    "debugging",
  ]);
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter X"
        title="Facing the Council"
        subtitle="Stand before the interviewers and prove your mastery. Each persona will challenge you differently — choose wisely."
        icon={<Swords className="w-6 h-6 text-nebula-400" />}
      />

      {!sessionStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
            selectedCategories={selectedCategories}
            onToggleCategory={(cat) =>
              setSelectedCategories((prev) =>
                prev.includes(cat)
                  ? prev.filter((c) => c !== cat)
                  : [...prev, cat]
              )
            }
          />

          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setSessionStarted(true)}
              icon={<ArrowRight className="w-5 h-5" />}
              className="px-12"
            >
              Enter the Council Chamber
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between p-4 rounded-xl border border-nebula-500/30 bg-nebula-500/5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-aurora-400 animate-pulse" />
              <span className="text-stardust-300 text-sm font-mono">
                Council Session Active — Persona:{" "}
                <span className="text-nebula-400 capitalize">
                  {selectedPersona.replace("-", " ")}
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSessionStarted(false)}
            >
              Change Persona
            </Button>
          </div>

          <InterviewChat
            persona={selectedPersona}
            categories={selectedCategories}
            projectContext={buildContextString(project)}
          />

          <div className="flex justify-center pt-6">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/dashboard/gaps")}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              End Session & Reveal Gaps
            </Button>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
}
