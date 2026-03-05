# Policy Graph Explorer — Take-Home Challenge

## Overview

Build a **policy document management MVP** that ingests PDF compliance documents, constructs a knowledge graph from their content, and provides a Graph-RAG chatbot for querying policies. There are no limits to your creativity, just build something useful. Think of it this way:
Our customers want to see something and based on that decide if they are going to enter a commercial engangement with us. We only have two days to show them what they want.

**Time limit:** 48 hours from when you start.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+ (package manager and runtime)
- Node.js 20+
- An OpenAI API key (provided separately)

### Setup

```bash
# Install dependencies
bun install

# Copy environment config
cp .env.example .env
# → Add your OPENAI_API_KEY to .env

# Start the dev server
bun run dev

# Open http://localhost:3000
```

### Project Structure

This is a **Turborepo monorepo** with the following layout:

```
apps/web/           → Next.js 15 application (your main workspace)
pkgs/ui/            → Shared UI components (shadcn/Radix)
pkgs/domain/        → Shared Zod schemas and types
pkgs/config-*/      → Shared TypeScript and ESLint configuration
```

---

## Requirements

### Must-Have (Core)

1. **PDF Ingestion**
   - Upload interface for PDF files
   - Parse PDFs and extract text content
   - Chunk documents into meaningful sections (by heading, paragraph, or fixed window)
   - Store chunks with stable, deterministic IDs

2. **Knowledge Graph Construction**
   - Extract entities and relationships from policy documents
   - Build a graph with typed nodes (e.g., `policy`, `concept`, `requirement`, `entity`) and typed edges (e.g., `references`, `requires`, `conflicts_with`)
   - Graph must capture cross-document relationships

3. **Graph Visualization**
   - Interactive, browsable graph view
   - Nodes and edges should be visually distinguishable by type
   - Click a node to see its details and connections

4. **Graph-RAG Chatbot**
   - Chat interface (scaffolded for you — see `apps/web/src/components/chat/`)
   - Retrieval must use graph structure, not just vector similarity
   - Answers must include citations to specific documents and sections
   - Use the Vercel AI SDK streaming pattern (scaffolded in `/api/chat`)

### Ideas for Stretch Goals

5. **Document Viewer** — browse uploaded documents with full content display
6. **Related Documents Sidebar** — select a document, see graph-connected related docs
7. **Paragraph Cross-References** — highlight a paragraph, see related content in other documents
8. **Graph Search / Filtering** — filter graph by node type, document, or keyword
9. **Persistence** — data survives server restart (SQLite, Postgres, file-based, etc.)
10. **Tests** — unit or integration tests for key logic
11. **Improved Citations** — user can click on citation and see exactly where the information from the document comes from

---

## Constraints

- **Package manager:** Bun (not npm/pnpm)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode is enabled)
- **LLM:** OpenAI via `@ai-sdk/openai` (Vercel AI SDK)
- **Styling:** Tailwind CSS v4 + shadcn components from `@repo/ui`
- **Validation:** Zod

You are free to choose:
- Graph storage (Neo4j, Postgres, SQLite, in-memory, file-based, etc.)
- PDF parsing library
- Graph visualization library (react-force-graph, d3, cytoscape, vis-network, etc.)
- Embedding/vector storage approach (if any)
- Any additional libraries you need

---

## Coding Conventions

This starter mirrors our internal codebase conventions. We evaluate whether you follow them:

- **Imports:** Use `import type` for type-only imports
- **Validation:** Zod schemas with `.safeParse()` for request validation
- **API routes:** Named exports (`GET`, `POST`), structured error responses
- **Components:** `"use client"` directive, TypeScript interfaces for props, `cn()` for class merging
- **Error handling:** Try-catch with structured logging via `logger()` from `@/lib/logger`
- **Files:** PascalCase for components, camelCase for utilities, kebab-case for folders
- **TypeScript:** `strict: true`, `noUncheckedIndexedAccess: true`

Look at the scaffolded code for examples of each pattern.

---

## Submission

1. Push your solution to a **private GitHub repository**
2. Add `erikkrauter-lfg` as a collaborator
3. Include a completed `DECISIONS.md` (template provided)
4. (Optional) Deploy to Vercel/Railway/etc. and include the URL
5. (Optional) Include a short Loom/screen recording demo

---

## What's Already Built

The following is scaffolded and working:

- Monorepo with Turbo, Bun workspaces, TypeScript strict config, ESLint
- Next.js app with sidebar navigation and page routing
- Chat UI with `useChat` from `@ai-sdk/react` (wired to `/api/chat`)
- Chat API route with `streamText` + `createUIMessageStream` (basic echo mode)
- API stubs for `/api/ingest` and `/api/graph` with Zod validation patterns
- shadcn components: Button, Input, Textarea, Card, ScrollArea, Badge, etc.
- Domain schemas: `Document`, `Chunk`, `GraphNode`, `GraphEdge`, `Citation`
- Logger utility matching our internal pattern
- Home page with navigation cards

Note, that the scaffold is meant as a guidline, you can change things if you find it necessary and if you want to make it more beatiful ;D
---

## Provided Documents

These are corporate compliance policy documents covering topics like gifts & entertainment, anti-corruption, antitrust, business conduct, and related supplementary documents. The documents reference each other somehow. The data is anonymized but very similar to real data.

---

## Tips

- Start with ingestion → graph → then RAG. Get the pipeline working end-to-end before polishing.
- A simple but working graph (even keyword/section-based) is better than a sophisticated but broken one.
- Graph-RAG means retrieval should traverse the graph, not just do vector similarity. Show us the graph adds value.
- Your users are Compliance Officers and Legal Experts, they want explainability, control, and anything that adds trust - they are risk-averse. 
- You are allowed to mock stuff, the users/customers are not technical and will probably not know.
- We value clear thinking (DECISIONS.md) as much as clean code.
- Don't over-engineer. 48 hours is tight — ship something that works.
