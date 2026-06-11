export const DEMO_PROJECT = {
  name: "NexaCommerce",
  tagline: "High-performance full-stack B2B/B2C e-commerce platform built with Next.js 14 and Stripe.",
  stack: {
    frontend: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Prisma ORM", "Next.js Route Handlers"],
    database: ["PostgreSQL", "Redis"],
    devops: ["Docker", "AWS S3", "GitHub Actions"],
    payments: ["Stripe"]
  },
  stats: {
    files: 147,
    loc: 23840,
    functions: 412,
    dependencies: 89
  },
  scores: {
    readiness: 84,
    security: 71,
    maintainability: 75,
    coverage: 45,
    techDebt: 50,
    risk: 23,
    complexity: 68
  },
  entryPoints: [
    { file: "src/app/layout.tsx", purpose: "Root layout, global styles, and React Context providers." },
    { file: "src/app/api/auth/[...nextauth]/route.ts", purpose: "NextAuth credential & OAuth handler." },
    { file: "src/lib/prisma.ts", purpose: "Prisma client singleton helper to prevent DB pool exhaustion." },
    { file: "src/middleware.ts", purpose: "Edge-based JWT verification routing guard." },
    { file: "src/app/api/stripe/webhook/route.ts", purpose: "Stripe payment signature validation and fulfillment logic." }
  ],
  fileTree: {
    name: "NexaCommerce",
    path: "root",
    type: "directory",
    children: [
      {
        name: "src",
        path: "src",
        type: "directory",
        children: [
          {
            name: "app",
            path: "src/app",
            type: "directory",
            children: [
              { name: "layout.tsx", path: "src/app/layout.tsx", type: "file", size: 1450, language: "tsx" },
              { name: "page.tsx", path: "src/app/page.tsx", type: "file", size: 3840, language: "tsx" },
              { name: "middleware.ts", path: "src/middleware.ts", type: "file", size: 1120, language: "typescript" },
              {
                name: "api",
                path: "src/app/api",
                type: "directory",
                children: [
                  {
                    name: "auth",
                    path: "src/app/api/auth",
                    type: "directory",
                    children: [
                      { name: "route.ts", path: "src/app/api/auth/route.ts", type: "file", size: 2150, language: "typescript" }
                    ]
                  },
                  {
                    name: "stripe",
                    path: "src/app/api/stripe",
                    type: "directory",
                    children: [
                      { name: "webhook.ts", path: "src/app/api/stripe/webhook.ts", type: "file", size: 3100, language: "typescript" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "lib",
            path: "src/lib",
            type: "directory",
            children: [
              { name: "prisma.ts", path: "src/lib/prisma.ts", type: "file", size: 540, language: "typescript" },
              { name: "auth.ts", path: "src/lib/auth.ts", type: "file", size: 3600, language: "typescript" },
              { name: "redis.ts", path: "src/lib/redis.ts", type: "file", size: 890, language: "typescript" }
            ]
          }
        ]
      },
      { name: "package.json", path: "package.json", type: "file", size: 1840, language: "json" },
      { name: "Dockerfile", path: "Dockerfile", type: "file", size: 920, language: "dockerfile" }
    ]
  },
  securityIssues: [
    {
      severity: "HIGH",
      file: "src/app/api/stripe/webhook/route.ts",
      line: 24,
      description: "Stripe signature validation is bypassed when the NODE_ENV is set to development. This allows malicious actors to forge payment successful events.",
      code: `// Danger check
if (process.env.NODE_ENV === 'development') {
  event = JSON.parse(body); // Signature not verified
} else {
  event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
}`,
      fixSuggestion: `// Always verify signatures in dev by using local Stripe CLI webhook forwarding secret
event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);`
    },
    {
      severity: "HIGH",
      file: "src/lib/auth.ts",
      line: 87,
      description: "JWT token validation uses a weak HS256 key configured from a fallback static string 'DEFAULT_SECRET_KEY' instead of throwing an environment configuration error.",
      code: `const secret = process.env.NEXTAUTH_SECRET || 'DEFAULT_SECRET_KEY';
const token = jwt.verify(req.headers.authorization, secret);`,
      fixSuggestion: `const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  throw new Error("CRITICAL: NEXTAUTH_SECRET is not configured.");
}`
    },
    {
      severity: "MEDIUM",
      file: "src/app/api/auth/route.ts",
      line: 45,
      description: "Password hashing uses BCrypt with only 4 rounds (saltRounds), making user credentials vulnerable to brute force cracking attacks.",
      code: `const hashedPassword = await bcrypt.hash(password, 4);`,
      fixSuggestion: `const hashedPassword = await bcrypt.hash(password, 12);`
    },
    {
      severity: "INFO",
      file: "Dockerfile",
      line: 12,
      description: "Container builds run with root user privileges instead of mapping to a non-privileged system user.",
      code: `FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]`,
      fixSuggestion: `USER node`
    }
  ],
  bugs: [
    {
      type: "Logic",
      file: "src/lib/auth.ts",
      line: 110,
      description: "Session expiration dates are calculated incorrectly on login renewal, leading to tokens that expire instantly on specific client browsers.",
      codeSnippet: `const expires = new Date();
expires.setSeconds(expires.getSeconds() - 3600); // Bug: subtracted instead of added`,
      fixSnippet: `const expires = new Date();
expires.setSeconds(expires.getSeconds() + 3600);`
    },
    {
      type: "Performance",
      file: "src/lib/prisma.ts",
      line: 32,
      description: "Database queries pull nested product listings, order history, and full descriptions recursively without pagination during global item search.",
      codeSnippet: `const results = await prisma.product.findMany({
  where: { name: { contains: query } },
  include: { reviews: true, categories: true, orders: true }
});`,
      fixSnippet: `const results = await prisma.product.findMany({
  where: { name: { contains: query } },
  take: 20, // Paginate results
  select: { id: true, name: true, price: true }
});`
    },
    {
      type: "Dead Code",
      file: "src/app/page.tsx",
      line: 144,
      description: "Deprecated legacy client checkout logic is loaded into the main page bundle but never invoked.",
      codeSnippet: `function legacyStripeRedirect(cartId) {
  // Deprecated payment integration
  console.log("Redirecting to Stripe v2 endpoint...");
}`,
      fixSnippet: `// Removed legacy code entirely to reduce JS bundle overhead.`
    }
  ],
  complexFunctions: [
    {
      name: "calculateCartFulfillmentOptions",
      file: "src/lib/cart.ts",
      complexity: 14,
      lines: 120
    },
    {
      name: "verifyStripeSignatureAndBuildOrder",
      file: "src/app/api/stripe/webhook/route.ts",
      complexity: 12,
      lines: 85
    },
    {
      name: "resolveNestedCategories",
      file: "src/lib/categories.ts",
      complexity: 9,
      lines: 55
    },
    {
      name: "authorizeUserCredentials",
      file: "src/lib/auth.ts",
      complexity: 8,
      lines: 70
    },
    {
      name: "invalidateSessionAndCache",
      file: "src/lib/redis.ts",
      complexity: 7,
      lines: 40
    }
  ],
  timeline: [
    {
      version: "v0.4",
      date: "May 12, 2026",
      commits: 48,
      changes: [
        "Implemented secure Stripe webhook authentication flow.",
        "Refactored Prisma adapter to use database client singletons.",
        "Optimized Docker container builds with multi-stage execution."
      ]
    },
    {
      version: "v0.3",
      date: "April 05, 2026",
      commits: 34,
      changes: [
        "Integrated Redis session caches for high performance cart reads.",
        "Added JWT credential refresh tokens and Edge-based authorization guards."
      ]
    },
    {
      version: "v0.2",
      date: "March 18, 2026",
      commits: 22,
      changes: [
        "Built admin database migration scripts.",
        "Created client checkout page layouts and product listing grids."
      ]
    },
    {
      version: "v0.1",
      date: "February 10, 2026",
      commits: 12,
      changes: [
        "Initial commit: repository configuration setup.",
        "Created basic PostgreSQL schemas with Prisma."
      ]
    }
  ],
  quizQuestions: {
    easy: [
      {
        type: "mcq",
        question: "Which database client pattern is used in NexaCommerce to prevent exhausting the Postgres connection pool?",
        options: [
          "Re-initializing the PrismaClient on every request",
          "A global singleton instance stored on the Node global object",
          "Connecting through a raw REST gateway proxy",
          "Spinning up connection clusters per thread"
        ],
        answer: "A global singleton instance stored on the Node global object",
        explanation: "By assigning the PrismaClient instance to globalThis in development, we prevent Next.js hot-reloading from creating redundant DB connection pools."
      },
      {
        type: "open",
        question: "Describe why password salt rounds should not be set too low (e.g. 4) in production credentials registration.",
        answer: "brute force",
        explanation: "Low salt rounds reduce hashing time dramatically, leaving password hashes highly vulnerable to brute-force offline dictionary cracking attacks."
      }
    ],
    medium: [
      {
        type: "mcq",
        question: "In src/middleware.ts, where is the validation of the user authentication token executed?",
        options: [
          "Inside a background Cron worker task",
          "At the serverless edge before rendering the route",
          "Exclusively on client browser mount states",
          "Directly inside the PostgreSQL database store triggers"
        ],
        answer: "At the serverless edge before rendering the route",
        explanation: "Next.js Middleware intercepts incoming requests at the Edge runtime, executing route-level protection checks before pages render."
      }
    ],
    hard: [
      {
        type: "mcq",
        question: "What security risk is created by checking NODE_ENV === 'development' inside the Stripe webhook signature validation block?",
        options: [
          "Next.js telemetry data gets exposed to third parties",
          "Attackers can forge checkout events by passing mock payloads without validation keys",
          "Stripe stops sending invoice alerts to standard webhooks",
          "Prisma queries trigger connection pool bottlenecks"
        ],
        answer: "Attackers can forge checkout events by passing mock payloads without validation keys",
        explanation: "Bypassing webhook signature validation allows anyone to send arbitrary post requests to the checkout fulfillment route and execute unauthorized actions."
      }
    ]
  },
  roadmap: {
    beginner: [
      {
        id: "beg-1",
        name: "Understand Prisma Schema Definition",
        hours: 2,
        relatedFiles: ["prisma/schema.prisma"],
        status: "Complete"
      },
      {
        id: "beg-2",
        name: "Set Up Local Environment Variables",
        hours: 1,
        relatedFiles: [".env.local.example"],
        status: "Complete"
      }
    ],
    intermediate: [
      {
        id: "int-1",
        name: "Review NextAuth Credential Configuration",
        hours: 3,
        relatedFiles: ["src/lib/auth.ts", "src/app/api/auth/[...nextauth]/route.ts"],
        status: "In Progress"
      },
      {
        id: "int-2",
        name: "Understand Edge-level JWT Routing Guards",
        hours: 2,
        relatedFiles: ["src/middleware.ts"],
        status: "Not Started"
      }
    ],
    advanced: [
      {
        id: "adv-1",
        name: "Inspect Stripe Webhook Signature Verification Flow",
        hours: 4,
        relatedFiles: ["src/app/api/stripe/webhook/route.ts"],
        status: "Not Started"
      },
      {
        id: "adv-2",
        name: "Optimize Multi-stage Docker Build Execution",
        hours: 3,
        relatedFiles: ["Dockerfile"],
        status: "Not Started"
      }
    ]
  },
  resumeBullets: [
    "Architected and deployed NexaCommerce using Next.js 14 and Stripe, resulting in a full-featured B2B/B2C storefront servicing high-throughput checkout workflows.",
    "Integrated secure Webhook signature verification pipelines, mitigating spoofing vectors and enforcing transaction integrity across payment events.",
    "Engineered database connection manager singletons with Prisma and PostgreSQL, eliminating connection exhaustion issues and optimizing read response times by 30%.",
    "Constructed Edge-based routing middleware filters for JWT authentication checking, improving rendering speed and protecting administrative sub-routes from privilege escalation.",
    "Formulated production-grade Docker deployment configurations and multi-stage container pipelines to minimize load payloads and accelerate scaling times."
  ],
  goodFirstIssues: [
    {
      title: "Add standard email validation regex during user register post handlers",
      description: "Ensure that email addresses conform to RFC standards prior to saving them to PostgreSQL via Prisma.",
      effort: "Low",
      files: ["src/app/api/auth/register/route.ts"]
    },
    {
      title: "Implement fallback cache key lookup in Redis client session requests",
      description: "When Redis encounters network connection errors, query database fallback nodes gracefully instead of throwing exceptions.",
      effort: "Medium",
      files: ["src/lib/redis.ts"]
    },
    {
      title: "Write integration test suites for cart price summation logic",
      description: "Verify that multi-currency carts combine values correctly, applying promotional coupon codes securely.",
      effort: "High",
      files: ["src/lib/cart.test.ts"]
    }
  ]
};
