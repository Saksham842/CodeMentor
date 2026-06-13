# CodeMentor AI — The Codebase Oracle

AI-powered codebase analysis platform. Upload a project (ZIP or GitHub URL) and get instant insights — architecture diagrams, security audits, complexity metrics, contributor analytics, interview simulations, resume generation, and an interactive code chat.

Built with **React + Vite** frontend, **Express** backend, and **Groq** for AI inference.

---

## Features

| Feature | Description |
|---|---|
| **Project Upload** | Drag-and-drop ZIP upload or paste a GitHub URL to analyze any codebase |
| **Code Explorer** | Browse the full file tree with syntax-highlighted code, LOC stats, and AI explanations per file |
| **Chat** | Conversational AI that answers questions about your project with context-aware responses |
| **Architecture** | Auto-generated system diagram, database schema visualization, and auth flow |
| **Security Audit** | AI-powered vulnerability scanning with before/after code for each finding |
| **Complexity Report** | Cyclomatic complexity metrics per function, hotspots ranked by risk |
| **Contributor Analytics** | Git-style contributor stats, commit frequency, and authorship breakdown |
| **Interview Simulator** | Role-play with AI personas (Brutal CTO, Cynical Architect, etc.) targeting specific code areas |
| **Quiz Generator** | Auto-generated project quizzes — MCQs and open-ended questions |
| **Resume Builder** | AI-generated ATS-optimized bullet points from project context |
| **Code Review** | Multi-perspective AI code review across architecture, security, and performance |
| **Defense Simulator** | Pressure-test your decisions with configurable intensity levels |
| **Knowledge Base** | Searchable library of auto-generated project documentation |
| **Onboarding** | Structured day-by-day learning path for new team members |
| **Roadmap / Timeline** | Visualize tech debt, milestones, and project evolution |
| **Search** | Semantic code search with ranked file-level results |
| **Security Gaps** | Targeted gap analysis across categories like auth, caching, deployment |

---

## Project Structure

```
├── client/                    # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx            # Root router with lazy-loaded routes
│       ├── main.jsx           # Entry point
│       ├── components/
│       │   ├── animations/    # FloatingOrb, StarField, TypewriterText, etc.
│       │   ├── architecture/  # AuthFlow, DBSchema, SystemDiagram
│       │   ├── charts/        # BarChart, ComplexityRings, RadarChart
│       │   ├── chat/          # ChatInput, ChatInterface, ChatMessage, FileCitation
│       │   ├── explorer/      # FileDetail, FileTree
│       │   ├── interview/     # IntensityMeter, InterviewChat, PersonaSelector
│       │   ├── layout/        # Header, Layout, PageWrapper, SectionHeader, Sidebar
│       │   ├── resume/        # BulletEditor, ExportButtons
│       │   ├── ui/            # Badge, Button, Card, CodeBlock, Input, Modal, etc.
│       │   └── upload/        # AnalysisLoader, UploadModal
│       ├── hooks/             # useAnimation, useChat, useGrok, useLocalStorage, useProject
│       ├── lib/               # grok.js, projectParser.js, projectContext.js, prompts.js, utils.js
│       ├── pages/
│       │   ├── page.jsx             # Landing page
│       │   ├── (auth)/              # Login, Register
│       │   └── dashboard/           # 20+ dashboard pages
│       └── styles/
│           └── globals.css          # Tailwind + custom utilities
├── server/                    # Backend (Express)
│   ├── server.js              # Entry point
│   ├── controllers/           # grokController, projectController, uploadController
│   ├── routes/                # grok.js, project.js, upload.js
│   ├── services/              # grokService.js, promptService.js
│   └── middleware/            # errorHandler.js
├── uploads/                   # Temporary upload storage
├── .env                       # Environment variables
├── package.json               # Scripts and dependencies
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Groq API key** — sign up at [console.groq.com](https://console.groq.com)

### Setup

```bash
# 1. Install dependencies (from project root)
npm install

# 2. Configure your API key
# Edit .env in the project root:
#   GROQ_API_KEY=gsk_your_key_here

# 3. Start development (frontend + backend)
npm run dev
```

The frontend runs on **http://localhost:5173** and the backend on **http://localhost:3001**.

### Production Build

```bash
npm run build       # Builds client to client/dist/
npm start           # Serves client/dist via Express on port 3001

### Docker

```bash
# Production mode (serves built app on port 3001)
docker compose up

# Development mode (Vite hot-reload on 5173 + Express on 3001)
docker compose --profile dev up

# Rebuild after dependency changes
docker compose build
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client (Vite hot-reload) and server (Express) concurrently |
| `npm run client` | Start Vite dev server only |
| `npm run server` | Start Express server only |
| `npm run build` | Production build of client |
| `npm start` | Serve production build via Express |
| `npm run preview` | Preview production build via Vite |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | — | Groq API key from [console.groq.com](https://console.groq.com) |
| `PORT` | No | `3001` | Express server port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin for dev |

---

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/grok/chat` | Conversational Q&A about the codebase |
| `POST` | `/api/grok/analyze` | Deep analysis of a specific file or topic |
| `POST` | `/api/grok/search` | Semantic code search across the project |
| `POST` | `/api/grok/quiz` | Generate quiz questions from project context |
| `POST` | `/api/grok/interview` | Run an AI persona interview session |
| `POST` | `/api/grok/resume` | Generate ATS-optimized bullet points |
| `POST` | `/api/grok/security` | Full security audit report |
| `POST` | `/api/grok/review` | Multi-perspective code review |
| `POST` | `/api/project/analyze` | Analyze a project from multipart/form-data or JSON |
| `POST` | `/api/upload` | Upload a ZIP file for parsing |

---

## AI Model

This project uses **Groq** for inference — specifically `llama-3.3-70b-versatile` (configurable in `server/services/grokService.js` and `client/src/lib/grok.js`).

Groq provides fast inference on open-source models with generous free tier quotas.

---

## Tech Stack

### Frontend
- **React 18** with Vite 6
- **React Router 7** — lazy-loaded route-level code splitting
- **Tailwind CSS 3** — custom design system (nebula, aurora, cosmic color palette)
- **Framer Motion + GSAP** — page transitions and micro-animations
- **Recharts** — interactive charts (complexity, radar, bar)
- **react-syntax-highlighter** — file code display
- **react-dropzone** — ZIP upload
- **zustand** — state management with localStorage persistence
- **JSZip** — client-side ZIP extraction

### Backend
- **Express 5** — API server
- **Multer** — file upload handling
- **CORS** — cross-origin support

---

## Uploading a Project

1. Click **"Upload Your Project"** on the landing page
2. Either:
   - **Drag & drop** a ZIP file of your codebase
   - **Paste a GitHub URL** (e.g., `https://github.com/user/repo`)
3. The parser extracts file tree, counts lines of code, detects languages and tech stack
4. All dashboard features become active with your project context

> **Note:** Project data is stored in your browser's localStorage. No data is sent to external servers except for AI requests (which include project context for accurate analysis).

---

## Troubleshooting

**"Set GROQ_API_KEY for full AI-powered analysis"**
→ Your Groq API key is missing or invalid. Check `.env` and restart the server.

**Build fails on Windows**
→ Ensure you're using PowerShell and have Node.js v18+. Try `npm run build` from the client directory: `cd client && npx vite build`.

**CORS errors in dev**
→ Frontend proxies `/api` to `localhost:3001` via Vite config. Make sure the server is running.

**Large bundle warnings**
→ The `CodeBlock` chunk (~781 KB) comes from `react-syntax-highlighter`. This is expected and only loads when viewing code.
