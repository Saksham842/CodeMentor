import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { CodeBlock } from "../ui/CodeBlock";
import { SlideOver } from "../ui/SlideOver";
import { Badge } from "../ui/Badge";
import { Sparkles, Library, RefreshCw } from "lucide-react";
import { showToast } from "../ui/Toast";

export function FileDetail({ filePath }) {
  const [showAIExplainer, setShowAIExplainer] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [loadingExplainer, setLoadingExplainer] = useState(false);

  const getFileData = () => {
    if (filePath.includes("auth.ts")) {
      return {
        purpose: "Orchestrates authentication checks, hashes client passwords, and signs JWT tokens.",
        responsibilities: [
          "Verifies user credentials on authentication requests.",
          "Establishes cryptographically signed JWT hashes.",
          "Exposes login credentials providers for NextAuth hooks."
        ],
        functions: [
          { name: "authorizeUserCredentials", purpose: "Authenticates request emails against PostgreSQL hashes.", lines: 70 },
          { name: "generateTokenClaims", purpose: "Populates role properties onto cookie tokens.", lines: 35 },
          { name: "verifyPasswordHash", purpose: "Compares clean passwords to BCrypt hashes.", lines: 20 }
        ],
        dependencies: ["next-auth", "bcrypt", "prisma"],
        relationships: ["src/app/api/auth/[...nextauth]/route.ts", "src/middleware.ts"],
        code: `import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  session: { strategy: "jwt" }
};`
      };
    }
    
    return {
      purpose: "Exposes codebase utility interfaces and functions.",
      responsibilities: [
        "Provides modular helper abstractions.",
        "Drives system logic execution."
      ],
      functions: [
        { name: "defaultHandler", purpose: "Default fallback handler for file requests.", lines: 15 }
      ],
      dependencies: ["lodash", "typescript"],
      relationships: ["src/app/page.tsx"],
      code: `// File details for ${filePath}
export function defaultHandler() {
  console.log("Analyzing file contents...");
}`
    };
  };

  const fileInfo = getFileData();

  const handleAIExplain = async () => {
    setLoadingExplainer(true);
    setShowAIExplainer(true);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Teach the contents and responsibilities of the file: ${filePath}. Code context: ${fileInfo.code}`,
        })
      });
      if (!res.ok) throw new Error("Grok service connection failure.");
      const data = await res.json();
      setAiContent(data.result);
    } catch (err) {
      showToast.error("Failed to fetch AI explanation: " + err.message);
      setAiContent("Failed to load AI response. Please check your GROQ_API_KEY environment variable settings.");
    } finally {
      setLoadingExplainer(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-rift pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">{filePath.split("/").pop()}</h2>
          <span className="text-xs font-mono text-comet">{filePath}</span>
        </div>
        
        <Button
          onClick={handleAIExplain}
          className="flex items-center gap-1.5 shadow-md"
          size="sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explain with Grok</span>
        </Button>
      </div>

      <Card className="p-5">
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-2">
          📜 Scroll Objective
        </h3>
        <p className="text-sm text-stardust leading-relaxed">{fileInfo.purpose}</p>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-3">
          ⚡ Key Duties
        </h3>
        <ul className="space-y-2 text-sm text-stardust">
          {fileInfo.responsibilities.map((resp, index) => (
            <li key={index} className="flex gap-2 items-start">
              <span className="text-nebula text-[10px] mt-1">⬡</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="overflow-x-auto border border-rift rounded-xl bg-cavern/40">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-void/40 border-b border-rift text-comet font-display uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Function Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">LOC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rift text-stardust">
            {fileInfo.functions.map((fn) => (
              <tr key={fn.name} className="hover:bg-rift/10">
                <td className="px-4 py-3 text-white font-semibold">{fn.name}()</td>
                <td className="px-4 py-3">{fn.purpose}</td>
                <td className="px-4 py-3 text-right text-comet">{fn.lines}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-[10px] font-display font-bold uppercase tracking-wider text-white mb-2">
            📦 Import Dependencies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {fileInfo.dependencies.map((dep) => (
              <Badge key={dep} variant="comet">
                {dep}
              </Badge>
            ))}
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="text-[10px] font-display font-bold uppercase tracking-wider text-white mb-2">
            🔗 System Connections
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {fileInfo.relationships.map((rel) => (
              <Badge key={rel} variant="nebula">
                {rel.split("/").pop() || rel}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white">
          💻 Code Snippet
        </h3>
        <CodeBlock code={fileInfo.code} language="typescript" showLineNumbers />
      </div>

      <SlideOver
        isOpen={showAIExplainer}
        onClose={() => setShowAIExplainer(false)}
        title={`AI Explainer: ${filePath.split("/").pop()}`}
      >
        {loadingExplainer ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
            <RefreshCw className="w-8 h-8 text-nebula animate-spin" />
            <p className="text-sm font-mono text-gradient-aurora">Decoding codebase scrolls...</p>
          </div>
        ) : (
          <div className="space-y-4 text-stardust leading-relaxed">
            {aiContent.split("\n\n").map((chunk, index) => {
              if (chunk.includes("```")) {
                const code = chunk.replace(/```typescript|```/g, "").trim();
                return <CodeBlock key={index} code={code} language="typescript" />;
              }
              return <p key={index} className="text-sm">{chunk}</p>;
            })}
          </div>
        )}
      </SlideOver>
    </div>
  );
}
