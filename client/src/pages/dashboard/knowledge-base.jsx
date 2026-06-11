import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library, Search, Plus, Loader2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { buildContextString } from "@/lib/projectContext";

const ARTICLES = (projectName) => [
  {
    id: "auth-flow",
    title: "Authentication Flow — How It Works",
    category: "Architecture",
    summary: "End-to-end walkthrough of the NextAuth.js session lifecycle.",
    content: `## Authentication Flow

${projectName} uses **NextAuth.js v5** with the Credentials and OAuth providers.

### Flow
1. User submits login form → POST /api/auth/signin
2. NextAuth validates credentials against Prisma (bcrypt compare)
3. JWT is issued and stored in httpOnly cookie
4. Middleware checks token on every protected route
5. Session exposed via useSession() hook client-side

### Key Files
- \`src/app/api/auth/[...nextauth]/route.ts\` — NextAuth config
- \`src/middleware.ts\` — Route protection
- \`src/lib/auth.ts\` — Helper: getServerSession()

### Security Considerations
- Passwords hashed with bcrypt (cost factor 12)
- CSRF protection via NextAuth built-in tokens
- Session expiry: 24h (configurable)
- Rate limiting on auth endpoints via Upstash Ratelimit`,
    codeExample: {
      language: "typescript",
      code: `// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}`,
    },
  },
  {
    id: "database-patterns",
    title: "Database Patterns & Prisma Usage",
    category: "Database",
    summary: "Common Prisma patterns used throughout the codebase.",
    content: `## Database Patterns

### Connection Management
Prisma Client is instantiated once as a singleton to prevent connection pool exhaustion in development with Next.js hot-reload.

### Common Patterns
- **Pagination:** Always use cursor-based pagination for large datasets
- **Eager Loading:** Use \`include\` to avoid N+1 queries
- **Transactions:** Use \`prisma.$transaction\` for multi-step writes
- **Raw Queries:** Use \`prisma.$queryRaw\` only for complex aggregations`,
    codeExample: {
      language: "typescript",
      code: `// Cursor-based pagination
const products = await prisma.product.findMany({
  take: 20,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  include: { vendor: true, images: true },
  where: { published: true },
  orderBy: { createdAt: "desc" },
});`,
    },
  },
  {
    id: "stripe-integration",
    title: "Stripe Connect Integration",
    category: "Payments",
    summary: "How vendor payouts work via Stripe Connect Express.",
    content: `## Stripe Connect Integration

### Architecture
${projectName} uses Stripe Connect Express, where:
- **Platform account:** Owns the Stripe account, takes platform fee
- **Connected accounts:** Vendor Stripe accounts, receive transfers

### Checkout Flow
1. Customer adds items from multiple vendors
2. Single PaymentIntent created for full cart total
3. After payment.succeeded webhook → create Transfers to vendors
4. Platform retains 5% fee automatically

### Webhook Reliability
All webhook handlers are idempotent using Stripe's event ID stored in DB.`,
    codeExample: {
      language: "typescript",
      code: `// Transfer to vendor after successful payment
await stripe.transfers.create({
  amount: vendorAmount, // in cents
  currency: "usd",
  destination: vendor.stripeAccountId,
  transfer_group: order.id,
  metadata: { orderId: order.id, vendorId: vendor.id },
});`,
    },
  },
  {
    id: "redis-caching",
    title: "Redis Caching Strategy",
    category: "Infrastructure",
    summary: "What is cached, for how long, and how cache invalidation works.",
    content: `## Redis Caching Strategy

### What We Cache
| Key Pattern | TTL | Content |
|---|---|---|
| \`cart:{userId}\` | 2h | Cart items array |
| \`product:{id}\` | 10min | Product details |
| \`search:{query}\` | 5min | Search results |
| \`session:{token}\` | 24h | User session |

### Cache Invalidation
- Product updates → delete \`product:{id}\` and \`search:*\`
- Order placed → delete \`cart:{userId}\`
- Manual: /api/admin/cache/flush (admin only)`,
    codeExample: {
      language: "typescript",
      code: `// src/lib/cache.ts
import { redis } from "./redis";

export async function getCached(
  key,
  fetcher,
  ttl = 600
) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}`,
    },
  },
  {
    id: "error-handling",
    title: "Error Handling Patterns",
    category: "Best Practices",
    summary: "Standardised error classes and API error response shapes.",
    content: `## Error Handling

### Custom Error Classes
All API routes throw typed errors that are caught by the error boundary middleware.

### API Error Response Shape
\`\`\`json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist",
    "statusCode": 404
  }
}
\`\`\`

### Client-Side Error Handling
- API errors → react-hot-toast notifications
- React error boundaries for component crashes
- Sentry integration for production error tracking`,
    codeExample: {
      language: "typescript",
      code: `// src/lib/errors.ts
export class AppError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// In API route:
throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);`,
    },
  },
  {
    id: "testing-guide",
    title: "Testing Guide",
    category: "Quality",
    summary: `How to write unit, integration, and E2E tests for ${projectName}.`,
    content: `## Testing Guide

### Test Stack
- **Unit/Integration:** Vitest + Testing Library
- **E2E:** Playwright
- **API Mocking:** MSW (Mock Service Worker)

### Running Tests
\`\`\`bash
npm run test          # Unit tests (watch mode)
npm run test:ci       # Unit tests (CI, no watch)
npm run test:e2e      # Playwright E2E
npm run test:coverage # Coverage report
\`\`\`

### What to Test
- All utility functions in \`src/lib/\`
- All API route handlers
- Critical user flows (login, checkout) via E2E`,
    codeExample: {
      language: "typescript",
      code: `// Example unit test
import { describe, it, expect } from "vitest";
import { calculateVendorPayout } from "@/lib/payments";

describe("calculateVendorPayout", () => {
  it("deducts platform fee correctly", () => {
    const result = calculateVendorPayout(10000, 0.05);
    expect(result).toBe(9500); // 5% fee deducted
  });
});`,
    },
  },
  {
    id: "deployment",
    title: "Deployment Guide",
    category: "DevOps",
    summary: `How to deploy ${projectName} to production on Vercel + Railway.`,
    content: `## Deployment Guide

### Production Stack
- **Frontend:** Vercel (automatic from main branch)
- **API:** Railway (Dockerfile-based)
- **Database:** Railway PostgreSQL
- **Redis:** Upstash (serverless Redis)
- **CDN:** Cloudflare for static assets

### Environment Variables
Set all variables from \`.env.example\` in your Vercel/Railway project settings.

### Deployment Checklist
- [ ] Run \`npm run build\` locally — zero errors
- [ ] Prisma migrations applied: \`npx prisma migrate deploy\`
- [ ] Stripe webhook endpoints registered
- [ ] Sentry DSN configured
- [ ] CORS origins whitelisted`,
    codeExample: {
      language: "bash",
      code: `# Zero-downtime deploy flow
git push origin main
# GitHub Actions runs tests
# On pass: Vercel auto-deploys frontend
# On pass: Railway redeploys API
# Prisma migrations run post-deploy hook`,
    },
  },
  {
    id: "performance",
    title: "Performance Optimisation Techniques",
    category: "Performance",
    summary: `Techniques used to keep ${projectName} fast at scale.`,
    content: `## Performance Optimisation

### Database
- Indexes on all foreign keys and frequently filtered columns
- Connection pooling via PgBouncer (100 connections max)
- Cursor pagination to avoid OFFSET performance degradation

### Frontend
- React Server Components for data-heavy pages (no client JS)
- Image optimisation via next/image (WebP + AVIF)
- Route segment-level caching with revalidatePath()

### API
- Redis caching for hot data (products, search)
- Response compression (gzip)
- Rate limiting: 100 req/min per IP (Upstash Ratelimit)

### Monitoring
- Core Web Vitals tracked via Vercel Analytics
- API latency tracked via Datadog APM`,
    codeExample: {
      language: "typescript",
      code: `// RSC data fetching with caching
export const revalidate = 60; // Revalidate every 60s

export default async function ProductPage({ params }) {
  // Runs on server, cached at CDN edge
  const product = await getProduct(params.id);
  return <ProductView product={product} />;
}`,
    },
  },
];

export default function KnowledgeBasePage() {
  const { project } = useProject();
  const projectName = project?.name || "project";
  const articles = ARTICLES(projectName);
  const categories = ["All", ...Array.from(new Set(articles.map((a) => a.category)))];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState(articles[0]);
  const [generating, setGenerating] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, articles]);

  const handleGenerateArticle = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/grok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "knowledge_article", topic: searchQuery || "CI/CD best practices", projectContext: buildContextString(project) }),
      });
      const data = await res.json();
      const newArticle = {
        id: `generated-${Date.now()}`,
        title: searchQuery || "CI/CD Best Practices",
        category: "Generated",
        summary: "AI-generated article from your codebase context.",
        content: data.result ?? "Article content could not be generated.",
      };
      setActiveArticle(newArticle);
      showToast.success("New article added to the Library!");
    } catch {
      showToast.error("Could not generate article.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageWrapper>
      <SectionHeader
        chapter="Chapter XVI"
        title="The Library"
        subtitle="Every secret of the codebase, distilled into searchable knowledge. Learn the ways of the realm."
        icon={<Library className="w-6 h-6 text-nebula-400" />}
      />

      <div className="flex gap-6 h-[70vh]">
        <div className="w-72 shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stardust-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-void-950/60 border border-vault-600/50 rounded-lg text-sm text-stardust-200 placeholder:text-stardust-500 focus:outline-none focus:ring-2 focus:ring-nebula-500/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border transition-all",
                  selectedCategory === cat
                    ? "bg-nebula-500/20 border-nebula-500/50 text-nebula-300"
                    : "border-vault-600/30 text-stardust-400 hover:text-stardust-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-vault-600">
            {filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg transition-all",
                  activeArticle?.id === article.id
                    ? "bg-nebula-500/15 border border-nebula-500/30"
                    : "hover:bg-vault-700/30 border border-transparent"
                )}
              >
                <div className="text-xs text-nebula-400 mb-0.5">{article.category}</div>
                <div className="text-sm text-stardust-200 font-medium line-clamp-2">
                  {article.title}
                </div>
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleGenerateArticle}
            disabled={generating}
            icon={generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          >
            {generating ? "Generating..." : "Generate New Article"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-vault-600">
          <AnimatePresence mode="wait">
            {activeArticle ? (
              <motion.div
                key={activeArticle.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <Card glow className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="nebula">{activeArticle.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-stardust-100 mb-2">
                    {activeArticle.title}
                  </h2>
                  <p className="text-stardust-400 mb-6">{activeArticle.summary}</p>
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-stardust-200 leading-relaxed">
                      {activeArticle.content}
                    </pre>
                  </div>
                  {activeArticle.codeExample && (
                    <div className="mt-6">
                      <CodeBlock
                        code={activeArticle.codeExample.code}
                        language={activeArticle.codeExample.language}
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-stardust-500">
                Select an article from the left panel
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
