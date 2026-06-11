import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Check, ChevronRight, Package } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";

const STEPS = [
  {
    id: 1,
    title: "Clone & Configure",
    duration: "5 min",
    content: `git clone https://github.com/org/nexacommerce
cd nexacommerce
cp .env.example .env.local
# Fill in your DATABASE_URL, STRIPE_SECRET_KEY, etc.`,
    language: "bash",
  },
  {
    id: 2,
    title: "Install Dependencies",
    duration: "5 min",
    content: `npm install
# Node 20+ required
# Verify: node --version`,
    language: "bash",
  },
  {
    id: 3,
    title: "Database Setup",
    duration: "5 min",
    content: `# Ensure PostgreSQL is running locally
npx prisma migrate dev --name init
npx prisma db seed
# Seeds: 3 vendors, 50 products, 10 test orders`,
    language: "bash",
  },
  {
    id: 4,
    title: "Run Dev Server",
    duration: "2 min",
    content: `npm run dev
# App: http://localhost:3000
# Prisma Studio: npx prisma studio`,
    language: "bash",
  },
  {
    id: 5,
    title: "Branch & PR Workflow",
    duration: "5 min",
    content: `# Always branch from main
git checkout -b feat/your-feature-name
# After changes:
git add .
git commit -m "feat: describe your change"
git push origin feat/your-feature-name
# Open PR → CI must pass → request review`,
    language: "bash",
  },
  {
    id: 6,
    title: "Code Standards",
    duration: "8 min",
    content: `# Run before every commit
npm run lint        # ESLint + Prettier
npm run typecheck   # TypeScript strict
npm run test        # Vitest unit tests

# Commit format: <type>(<scope>): <description>
# Types: feat | fix | docs | refactor | test | chore`,
    language: "bash",
  },
];

const CODE_OWNERSHIP = [
  { area: "Frontend / UI", owner: "Shoaib Ahmed", files: 47, badge: "nebula" },
  { area: "API / Backend", owner: "Alex Chen", files: 31, badge: "aurora" },
  { area: "Database / Prisma", owner: "Maria Santos", files: 12, badge: "solar" },
  { area: "DevOps / CI", owner: "Kai Okonkwo", files: 8, badge: "comet" },
  { area: "Testing", owner: "Shoaib Ahmed", files: 22, badge: "nebula" },
  { area: "Design System", owner: "Alex Chen", files: 16, badge: "aurora" },
];

const DEPS = [
  { name: "next", version: "15.0.0", purpose: "React framework with App Router" },
  { name: "prisma", version: "5.7.0", purpose: "Type-safe ORM for PostgreSQL" },
  { name: "stripe", version: "14.10.0", purpose: "Payments & vendor payouts" },
  { name: "next-auth", version: "5.0.0-beta.3", purpose: "Authentication" },
  { name: "redis", version: "4.6.11", purpose: "Session & cart caching" },
  { name: "@elastic/elasticsearch", version: "8.11.0", purpose: "Product search" },
];

export default function ContributorPage() {
  const { project } = useProject();
  const [activeStep, setActiveStep] = useState(1);

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XV"
        title="Join the Guild"
        subtitle="Every legend was once a first contribution. Follow the path, claim your issue, and leave your mark on the realm."
        icon={<Users className="w-6 h-6 text-aurora-400" />}
      />

      <div className="mb-8">
        <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center shrink-0">
              <button
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                  activeStep === step.id
                    ? "bg-nebula-500/20 border border-nebula-500/40 text-nebula-300"
                    : activeStep > step.id
                    ? "text-aurora-400"
                    : "text-stardust-500 hover:text-stardust-300"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                    activeStep === step.id
                      ? "bg-nebula-500 border-nebula-400 text-white"
                      : activeStep > step.id
                      ? "bg-aurora-500 border-aurora-400 text-white"
                      : "border-vault-500 text-stardust-500"
                  )}
                >
                  {activeStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                </div>
                <span className="text-sm font-medium whitespace-nowrap hidden sm:block">
                  {step.title}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-stardust-600 shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>

        {STEPS.map((step) =>
          activeStep === step.id ? (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card glow className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-semibold text-stardust-100">
                    Step {step.id}: {step.title}
                  </h3>
                  <Badge variant="comet">~{step.duration}</Badge>
                </div>
                <CodeBlock code={step.content} language={step.language} />
                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={step.id === 1}
                    onClick={() => setActiveStep((p) => p - 1)}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={step.id === STEPS.length}
                    onClick={() => setActiveStep((p) => p + 1)}
                  >
                    Next →
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : null
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-4">
          Good First Issues
        </h3>
        <StaggerReveal className="space-y-4">
          {(project?.goodFirstIssues || []).map((issue, i) => (
            <Card key={i} glow className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="aurora">good first issue</Badge>
                    {issue.labels?.map((label) => (
                      <Badge key={label} variant="comet">{label}</Badge>
                    ))}
                  </div>
                  <h4 className="text-base font-medium text-stardust-100 mb-1">
                    #{issue.number ?? i + 1} — {issue.title}
                  </h4>
                  <p className="text-sm text-stardust-400">{issue.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Claim →
                </Button>
              </div>
            </Card>
          ))}
        </StaggerReveal>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-4">
          Code Ownership
        </h3>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-vault-600/30 bg-void-950/40">
                <th className="text-left px-5 py-3 text-xs text-stardust-400 uppercase tracking-wider">
                  Area
                </th>
                <th className="text-left px-5 py-3 text-xs text-stardust-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-right px-5 py-3 text-xs text-stardust-400 uppercase tracking-wider">
                  Files
                </th>
              </tr>
            </thead>
            <tbody>
              {CODE_OWNERSHIP.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-vault-600/20 hover:bg-vault-700/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <Badge variant={row.badge}>{row.area}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-stardust-200">{row.owner}</td>
                  <td className="px-5 py-3 text-right text-sm font-mono text-stardust-400">
                    {row.files}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-stardust-100 mb-4">
          Key Dependencies
        </h3>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPS.map((dep) => (
            <Card key={dep.name} glow className="p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-nebula-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-bold text-stardust-100">
                      {dep.name}
                    </span>
                    <span className="text-xs font-mono text-stardust-500">v{dep.version}</span>
                  </div>
                  <p className="text-xs text-stardust-400">{dep.purpose}</p>
                </div>
              </div>
            </Card>
          ))}
        </StaggerReveal>
      </div>
    </PageWrapper>
  );
}
