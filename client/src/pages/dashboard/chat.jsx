import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { SYSTEM_PROMPTS } from "@/lib/prompts";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

export default function ChatPage() {
  const { project } = useProject();

  return (
    <PageWrapper>
      <SectionHeader chapter="Chapter II" title="Speak to the Oracle" />

      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-xs text-stardust/60 leading-relaxed mb-2">
          Consult the Oracle of CodeMentor AI. Retrieve information, inspect database schemas, or query architectural constraints about {project?.name || "this project"}.
        </p>

        <ChatInterface
          systemPrompt={SYSTEM_PROMPTS.chat}
          projectName={project?.name || ""}
          projectContext={buildContextString(project)}
          onCitationClick={(path) => {
            window.location.href = `/dashboard/explorer?file=${encodeURIComponent(path)}`;
          }}
        />
      </div>
    </PageWrapper>
  );
}
