import JSZip from "jszip";

const LANG_MAP = {
  ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
  json: "json", md: "markdown", css: "css", scss: "scss",
  html: "html", py: "python", rs: "rust", go: "go",
  java: "java", rb: "ruby", php: "php", yml: "yaml", yaml: "yaml",
  toml: "toml", sql: "sql", sh: "bash", dockerfile: "dockerfile",
  tf: "hcl", vue: "vue", svelte: "svelte", prisma: "prisma",
};

function ext(name) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase() : "";
}

function lang(name) {
  if (name.toLowerCase() === "dockerfile") return "dockerfile";
  return LANG_MAP[ext(name)] || "text";
}

function isCodeFile(name) {
  const skip = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".mp4", ".webm", ".ogg", ".wav", ".mp3", ".zip", ".exe", ".dll", ".so", ".o", ".class", ".jar"]);
  return !skip.has(ext(name));
}

function buildTree(files) {
  const root = { name: "root", path: "", type: "directory", children: [] };

  for (const f of files) {
    const parts = f.name.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const isLast = i === parts.length - 1;
      const p = parts[i];
      const fullPath = parts.slice(0, i + 1).join("/");

      if (isLast) {
        current.children.push({
          name: p,
          path: fullPath,
          type: "file",
          size: f.text.length,
          language: lang(p),
        });
      } else {
        let dir = current.children?.find((c) => c.name === p && c.type === "directory");
        if (!dir) {
          dir = { name: p, path: fullPath, type: "directory", children: [] };
          current.children.push(dir);
        }
        current = dir;
      }
    }
  }

  return root;
}

function getCodeFiles(files) {
  return files.filter((f) => isCodeFile(f.name));
}

function countLines(files) {
  return getCodeFiles(files).reduce((sum, f) => sum + f.text.split("\n").length, 0);
}

function getFileList(node, prefix = "") {
  const path = prefix ? `${prefix}/${node.name}` : node.name;
  if (node.type === "file") return [path];
  return (node.children || []).flatMap((c) => getFileList(c, path || ""));
}

function detectStack(files) {
  const stack = { frontend: [], backend: [], database: [], devops: [], payments: [] };
  const allNames = files.map((f) => f.name);
  const allText = files.map((f) => f.text).join("\n");

  if (allNames.some((n) => n.includes("next.config"))) stack.frontend.push("Next.js");
  if (allNames.some((n) => n === "vite.config.ts" || n === "vite.config.js")) stack.frontend.push("Vite");
  if (allNames.some((n) => n === "angular.json")) stack.frontend.push("Angular");
  if (allNames.some((n) => n.endsWith(".vue"))) stack.frontend.push("Vue.js");
  if (allText.includes("react") || allText.includes("React")) {
    if (!stack.frontend.includes("Next.js")) stack.frontend.push("React");
  }
  if (allNames.some((n) => n === "tailwind.config.js" || n === "tailwind.config.ts")) stack.frontend.push("Tailwind CSS");
  if (allNames.some((n) => n.endsWith(".css") || n.endsWith(".scss"))) stack.frontend.push("CSS/Sass");

  if (allNames.some((n) => n === "prisma" || n.includes("schema.prisma"))) stack.backend.push("Prisma");
  if (allText.includes("express") || allNames.some((n) => n.includes("routes"))) stack.backend.push("Express.js");
  if (allNames.some((n) => n.includes("graphql"))) stack.backend.push("GraphQL");
  if (allNames.some((n) => n.endsWith(".py"))) stack.backend.push("Python");
  if (allNames.some((n) => n.endsWith(".go"))) stack.backend.push("Go");
  if (allNames.some((n) => n.endsWith(".rs"))) stack.backend.push("Rust");
  if (!stack.backend.length) stack.backend.push("Node.js");

  if (allText.includes("postgres") || allText.includes("PostgreSQL") || allText.includes("pg")) stack.database.push("PostgreSQL");
  if (allText.includes("redis")) stack.database.push("Redis");
  if (allText.includes("mongodb") || allText.includes("mongoose") || allText.includes("MongoDB")) stack.database.push("MongoDB");
  if (allText.includes("mysql")) stack.database.push("MySQL");
  if (allText.includes("sqlite")) stack.database.push("SQLite");
  if (!stack.database.length) stack.database.push("Database");

  if (allNames.some((n) => n === "Dockerfile" || n.includes("docker-compose"))) stack.devops.push("Docker");
  if (allNames.some((n) => n.includes(".github/workflows"))) stack.devops.push("GitHub Actions");
  if (allText.includes("aws")) stack.devops.push("AWS");
  if (!stack.devops.length) stack.devops.push("Custom");

  if (allText.includes("stripe")) stack.payments.push("Stripe");

  return stack;
}

function findEntryPoints(files) {
  const eps = [];
  const names = files.map((f) => f.name);

  if (names.includes("src/app/layout.tsx")) eps.push({ file: "src/app/layout.tsx", purpose: "Root layout, global styles, and React Context providers." });
  if (names.includes("src/app/layout.jsx")) eps.push({ file: "src/app/layout.jsx", purpose: "Root layout." });
  if (names.some((n) => n.includes("middleware"))) {
    const m = names.find((n) => n.includes("middleware"));
    eps.push({ file: m, purpose: "Edge-based routing guard / middleware." });
  }
  if (names.some((n) => n.includes("prisma"))) {
    const m = names.find((n) => n.includes("prisma") && !n.includes("schema")) || names.find((n) => n.includes("prisma/schema"));
    if (m) eps.push({ file: m, purpose: "Database client singleton / schema." });
  }
  if (names.some((n) => n.includes("auth"))) {
    const m = names.find((n) => n.includes("auth"));
    eps.push({ file: m, purpose: "Authentication handler." });
  }
  if (!eps.length && names.length > 0) {
    eps.push({ file: names[0], purpose: "Main entry point." });
  }

  return eps;
}

function parsePackageJson(files) {
  const pkg = files.find((f) => f.name === "package.json");
  if (!pkg) return { deps: 0 };
  try {
    const json = JSON.parse(pkg.text);
    return { deps: Object.keys(json.dependencies || {}).length + Object.keys(json.devDependencies || {}).length };
  } catch {
    return { deps: 0 };
  }
}

export async function parseRepository(input) {
  let entries = [];

  if (input.file) {
    const buffer = await input.file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    const promises = [];
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && isCodeFile(relativePath)) {
        promises.push(
          (async () => {
            const text = await zipEntry.async("text");
            entries.push({ name: relativePath, text });
          })()
        );
      }
    });
    await Promise.all(promises);
  } else if (input.githubUrl) {
    const url = input.githubUrl.replace(/\/$/, "");
    const parts = url.split("/");
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1].replace(/\.git$/, "");

    const fetchDir = async (path) => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "codementor-ai" },
      });
      if (!res.ok) return;
      const items = await res.json();
      const filePromises = [];

      for (const item of items) {
        if (item.type === "file" && isCodeFile(item.name) && item.size < 500000) {
          filePromises.push(
            (async () => {
              try {
                const fileRes = await fetch(item.download_url, { headers: { "User-Agent": "codementor-ai" } });
                const text = await fileRes.text();
                entries.push({ name: item.path, text });
              } catch {}
            })()
          );
        } else if (item.type === "dir" && !item.name.startsWith(".") && item.name !== "node_modules") {
          await fetchDir(item.path);
        }
      }
      await Promise.all(filePromises);
    };

    await fetchDir("");
  } else {
    throw new Error("No file or GitHub URL provided.");
  }

  if (entries.length === 0) throw new Error("No code files found in the uploaded project.");

  const fileTree = buildTree(entries);
  const codeFiles = getCodeFiles(entries);
  const allFilePaths = getFileList(fileTree);
  const loc = countLines(codeFiles);
  const stack = detectStack(entries);
  const { deps } = parsePackageJson(entries);
  const entryPoints = findEntryPoints(entries);

  return {
    name: input.file
      ? input.file.name.replace(/\.zip$/i, "")
      : input.githubUrl.split("/").pop().replace(/\.git$/, "") || "CustomRepo",
    tagline: `A project built with ${[...new Set([...stack.frontend, ...stack.backend])].join(", ") || "modern technologies"}.`,
    stack,
    stats: { files: codeFiles.length, loc, functions: Math.round(loc / 58), dependencies: deps },
    scores: { readiness: 50, security: 50, maintainability: 50, coverage: 30, techDebt: 50, risk: 50, complexity: 50 },
    entryPoints,
    fileTree,
    securityIssues: [],
    bugs: [],
    complexFunctions: [],
    timeline: [
      { version: "v1.0", date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), commits: 1, changes: ["Initial analysis completed.", `${codeFiles.length} files decoded.`] }
    ],
    quizQuestions: { easy: [], medium: [], hard: [] },
    roadmap: { beginner: [], intermediate: [], advanced: [] },
    resumeBullets: [],
    goodFirstIssues: [],
  };
}
