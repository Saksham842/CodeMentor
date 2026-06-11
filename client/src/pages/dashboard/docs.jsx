import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Loader2, Download } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import StaggerReveal from "@/components/animations/StaggerReveal";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const README_CONTENT = (projectName) => `# ${projectName} — Production E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)

## Overview

${projectName} is a production-ready multi-vendor e-commerce platform built with Next.js 15 App Router, TypeScript, Prisma ORM, and PostgreSQL. It supports real-time inventory management, Stripe Connect for vendor payouts, and an advanced product search powered by Elasticsearch.

## Architecture

The platform follows a modular monolith pattern with clear domain boundaries:

\`\`\`
apps/
  web/          # Next.js 15 frontend
  api/          # Express REST API (separate deployment)
packages/
  database/     # Prisma schema + migrations
  shared/       # Shared types and utilities
  ui/           # Internal design system
\`\`\`

## Quick Start

\`\`\`bash
git clone https://github.com/org/${projectName.toLowerCase()}
cd ${projectName.toLowerCase()}
cp .env.example .env.local
npm install
npm run db:push
npm run dev
\`\`\`

## Environment Variables

| Variable | Description |
|---|---|
| \`DATABASE_URL\` | PostgreSQL connection string |
| \`STRIPE_SECRET_KEY\` | Stripe API key |
| \`NEXTAUTH_SECRET\` | NextAuth.js secret |
| \`REDIS_URL\` | Redis connection string |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.`;

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/products",
    description: "List all products with pagination and filtering",
    params: "?page=1&limit=20&category=electronics&sort=price_asc",
    response: '{ products: Product[], total: number, page: number }',
  },
  {
    method: "POST",
    path: "/api/products",
    description: "Create a new product listing",
    params: "Body: { name, price, category, inventory, images[] }",
    response: '{ product: Product, id: string }',
  },
  {
    method: "GET",
    path: "/api/orders/:id",
    description: "Get order details by ID",
    params: "Requires authentication header",
    response: '{ order: Order, lineItems: LineItem[], vendor: Vendor }',
  },
  {
    method: "POST",
    path: "/api/checkout",
    description: "Create Stripe payment intent",
    params: "Body: { cartItems[], shippingAddress, couponCode? }",
    response: '{ clientSecret: string, orderId: string }',
  },
  {
    method: "POST",
    path: "/api/webhooks/stripe",
    description: "Handle Stripe events (payment.succeeded, etc.)",
    params: "Stripe-Signature header required",
    response: '{ received: true }',
  },
  {
    method: "GET",
    path: "/api/search",
    description: "Full-text search across products and vendors",
    params: "?q=wireless+headphones&filters=price:10-200",
    response: '{ results: SearchResult[], took: number }',
  },
];

const ADR_CARDS = [
  {
    id: "ADR-001",
    title: "Use Next.js App Router Over Pages Router",
    status: "accepted",
    date: "2024-01-15",
    context:
      "Needed server-side rendering with fine-grained control over caching and streaming. Pages Router is deprecated.",
    decision:
      "Adopt Next.js 15 App Router with React Server Components for data-heavy pages, client components only where interactivity is required.",
    consequences:
      "Improved performance, but team learning curve for RSC mental model. Bundle size decreased 30%.",
  },
  {
    id: "ADR-002",
    title: "Prisma ORM Over Raw SQL",
    status: "accepted",
    date: "2024-01-22",
    context:
      "Team velocity required type-safe database queries. Raw SQL was error-prone and hard to refactor.",
    decision:
      "Use Prisma ORM with PostgreSQL. Accept performance overhead for type safety and developer experience.",
    consequences:
      "N+1 query issues must be carefully managed with eager loading. Complex queries still use $queryRaw.",
  },
  {
    id: "ADR-003",
    title: "Stripe Connect for Vendor Payouts",
    status: "accepted",
    date: "2024-02-10",
    context:
      "Multi-vendor marketplace requires splitting payments between platform and vendors with different payout schedules.",
    decision:
      "Use Stripe Connect Express for vendor onboarding and transfer-based payouts. Platform takes 5% fee.",
    consequences:
      "Vendor onboarding is streamlined but locked to Stripe ecosystem. Webhook reliability requires idempotency keys.",
  },
  {
    id: "ADR-004",
    title: "Redis for Session & Cart Caching",
    status: "proposed",
    date: "2024-03-01",
    context:
      "Cart state was being stored in PostgreSQL causing high read load during peak traffic.",
    decision:
      "Migrate cart state and user sessions to Redis with TTL-based expiry. Use Upstash for serverless Redis.",
    consequences:
      "Requires careful TTL management to prevent cart loss. Adds operational complexity but reduces DB load by ~40%.",
  },
];

const STATUS_CONFIG = {
  accepted: { label: "Accepted", badge: "aurora" },
  proposed: { label: "Proposed", badge: "solar" },
  deprecated: { label: "Deprecated", badge: "nebula" },
};

const METHOD_COLOR = {
  GET: "text-aurora-400 bg-aurora-500/10 border-aurora-500/30",
  POST: "text-nebula-400 bg-nebula-500/10 border-nebula-500/30",
  PUT: "text-solar-400 bg-solar-500/10 border-solar-500/30",
  DELETE: "text-nova-400 bg-nova-500/10 border-nova-500/30",
};

const TABS = [
  { id: "readme", label: "README" },
  { id: "api", label: "API Reference" },
  { id: "adr", label: "ADR" },
];

export default function DocsPage() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState("readme");
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [generatingADR, setGeneratingADR] = useState(null);
  const [generatedADR, setGeneratedADR] = useState({});

  const handleGenerateADR = async (idx) => {
    setGeneratingADR(idx);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "adr", adr: ADR_CARDS[idx], projectContext: buildContextString(project) }),
      });
      const data = await res.json();
      setGeneratedADR((prev) => ({ ...prev, [idx]: data.result ?? "" }));
    } catch {
      showToast.error("Failed to generate ADR.");
    } finally {
      setGeneratingADR(null);
    }
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([README_CONTENT(project?.name || "project")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("README.md downloaded!");
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XIV"
        title="The Grand Tome"
        subtitle="Every great kingdom needs its scripture. Auto-generated documentation from the depths of your codebase."
        icon={<BookOpen className="w-6 h-6 text-nebula-400" />}
      />

      <div className="flex items-center justify-between mb-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "readme" && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadReadme}
          >
            Export README
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "readme" && (
            <Card className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-stardust-200 font-mono leading-relaxed overflow-x-auto">
                {README_CONTENT(project?.name || "project")}
              </pre>
            </Card>
          )}

          {activeTab === "api" && (
            <div className="space-y-3">
              {API_ENDPOINTS.map((ep, idx) => (
                <Card
                  key={idx}
                  glow className="overflow-hidden cursor-pointer"
                  onClick={() =>
                    setExpandedEndpoint(expandedEndpoint === idx ? null : idx)
                  }
                >
                  <div className="p-4 flex items-center gap-4">
                    <span
                      className={cn(
                        "text-xs font-mono font-bold px-2 py-1 rounded border shrink-0",
                        METHOD_COLOR[ep.method]
                      )}
                    >
                      {ep.method}
                    </span>
                    <code className="text-stardust-200 text-sm font-mono flex-1">
                      {ep.path}
                    </code>
                    <span className="text-stardust-400 text-sm flex-1 hidden md:block">
                      {ep.description}
                    </span>
                    {expandedEndpoint === idx ? (
                      <ChevronUp className="w-4 h-4 text-stardust-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stardust-400 shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedEndpoint === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-vault-600/30 overflow-hidden"
                      >
                        <div className="p-5 space-y-3 bg-void-950/30">
                          <div>
                            <p className="text-xs text-stardust-400 uppercase tracking-wider mb-1">
                              Parameters
                            </p>
                            <code className="text-sm text-aurora-300 bg-aurora-500/5 px-3 py-1.5 rounded-lg block font-mono">
                              {ep.params}
                            </code>
                          </div>
                          <div>
                            <p className="text-xs text-stardust-400 uppercase tracking-wider mb-1">
                              Response
                            </p>
                            <code className="text-sm text-solar-300 bg-solar-500/5 px-3 py-1.5 rounded-lg block font-mono">
                              {ep.response}
                            </code>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "adr" && (
            <StaggerReveal className="space-y-6">
              {ADR_CARDS.map((adr, idx) => (
                <Card key={adr.id} elevated glow className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-stardust-400">{adr.id}</span>
                        <Badge variant={STATUS_CONFIG[adr.status].badge}>
                          {STATUS_CONFIG[adr.status].label}
                        </Badge>
                        <span className="text-xs text-stardust-500">{adr.date}</span>
                      </div>
                      <h4 className="text-base font-display font-semibold text-stardust-100">
                        {adr.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={generatingADR === idx}
                      onClick={() => handleGenerateADR(idx)}
                      icon={
                        generatingADR === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : undefined
                      }
                    >
                      {generatingADR === idx ? "Generating..." : "Generate ADR"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Context", text: adr.context },
                      { label: "Decision", text: adr.decision },
                      { label: "Consequences", text: adr.consequences },
                    ].map((section) => (
                      <div key={section.label}>
                        <p className="text-xs text-stardust-400 uppercase tracking-wider mb-1">
                          {section.label}
                        </p>
                        <p className="text-sm text-stardust-300">{section.text}</p>
                      </div>
                    ))}
                  </div>

                  {generatedADR[idx] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 rounded-xl bg-nebula-500/5 border border-nebula-500/20"
                    >
                      <p className="text-xs text-nebula-400 mb-2 font-mono">
                        ✦ Grok-Enhanced ADR
                      </p>
                      <pre className="text-sm text-stardust-200 whitespace-pre-wrap">
                        {generatedADR[idx]}
                      </pre>
                    </motion.div>
                  )}
                </Card>
              ))}
            </StaggerReveal>
          )}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
}
