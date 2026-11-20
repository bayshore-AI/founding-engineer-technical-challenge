# Regulatory Change → Policy Impact — Take-Home Challenge

## Overview

Build a product that helps a compliance team handle regulatory change: a new regulation arrives,
and the Compliance Officer needs to know whether it applies, which obligations it creates, which
internal policies are affected, where the gaps are, and how the policies must change, with every
step evidenced and decided by a human.

**Read [CHALLENGE.md](CHALLENGE.md) first.** It explains the bigger picture, the users, the
assignment, the non-negotiables and the deliverables.

**Time limit:** 2–3 days from when you start.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+ (package manager and runtime)
- Node.js 20+
- An OpenAI API key (provided separately)
- The company profile, GR-006 and the policy documents (provided separately by email)

### Setup

```bash
# Install dependencies
bun install

# Copy environment config
cp .env.example .env
# → Add your OPENAI_API_KEY to .env
# → FEED_AS_OF sets the simulated "today" for the regulatory feed

# Put the documents you received by email into /policies

# Start the dev server
bun run dev

# Open http://localhost:3000
```

Other commands: `bun run build`, `bun run lint`, `bun run check-types`, `bun run test`.

### Project Structure

This is a **Turborepo monorepo** with the following layout:

```
apps/web/            → Next.js 15 application (your main workspace)
pkgs/ui/             → Shared UI components (shadcn/Radix)
pkgs/domain/         → Shared Zod schemas and types (feed items, GR-006 vocabulary)
pkgs/config-*/       → Shared TypeScript and ESLint configuration
regulatory-feed/     → The regulatory feed: one Markdown file per item (read its README)
policies/            → Put the documents you received by email here
```

---

## The Regulatory Feed

`regulatory-feed/` stands in for a commercial horizon-scanning service. Each item is a Markdown
file with a YAML header (source id, version, status, change type, dates, ...) and the source text.
The date prefix of the file name is the day the item arrives.

- `FEED_AS_OF` in `.env` is the simulated "today". Only items dated on or before it have arrived.
  Move it forward to simulate time passing; `2027-03-31` shows everything.
- `apps/web/src/lib/feed` has a typed loader (`loadFeed`) with tests. Use it, change it, or replace
  it.
- Add your own items in the same format to test your product. At review we also run your app
  against a feed you have not seen, so don't hard-code anything about the provided items.

See [regulatory-feed/README.md](regulatory-feed/README.md) for the format.

---

## Constraints

- **Package manager:** Bun (not npm/pnpm)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode is enabled)
- **LLM:** OpenAI via `@ai-sdk/openai` (Vercel AI SDK), see `apps/web/src/lib/ai/openai.ts`
- **Styling:** Tailwind CSS v4 + shadcn components from `@repo/ui`
- **Validation:** Zod

You are free to choose:
- Storage (Postgres, SQLite, file-based, in-memory, etc.)
- PDF parsing library and how you structure the policy library
- Retrieval approach (embeddings, full text, structure-based, or a mix)
- Any additional libraries you need

---

## Coding Conventions

This starter mirrors our internal codebase conventions.

- **Imports:** Use `import type` for type-only imports
- **Validation:** Zod schemas with `.safeParse()` for request validation and external input
- **API routes:** Named exports (`GET`, `POST`), structured error responses
- **Components:** `"use client"` directive where needed, TypeScript interfaces for props, `cn()` for
  class merging
- **Error handling:** result pattern with neverthrow (see `apps/web/src/lib/feed/load-feed.ts`)
- **Files:** PascalCase for component names, camelCase for utilities, kebab-case for files and folders
- **TypeScript:** `strict: true`, `noUncheckedIndexedAccess: true`

---

## What's Already Built

- Monorepo with Turbo, Bun workspaces, TypeScript strict config, ESLint
- Next.js app with sidebar navigation: Regulatory feed, Change cases, Policy library
- Feed loader (`loadFeed`) with Zod validation, neverthrow results, as-of filtering and `bun test` tests
- Feed viewer: list of received items and a detail page per item with its clauses
- `GET /api/feed?asOf=YYYY-MM-DD` returning the received items
- Domain schemas: `FeedItem`, `Clause`, and the GR-006 vocabulary (`Applicability`,
  `CoverageFinding`, `Priority`)
- OpenAI provider for the Vercel AI SDK
- shadcn components: Button, Input, Textarea, Card, ScrollArea, Badge, etc.
- Logger utility matching our internal pattern

The Change cases and Policy library pages are empty: that is where your product starts. The
scaffold is a guideline; change anything you find necessary.

---

## Submission

1. Push your solution to a **private GitHub repository**
2. Add `erikkrauter-lfg` as a collaborator
3. Include a completed `DECISIONS.md` and `NEXT.md` (templates provided)
4. Include a short Loom/screen recording demo
5. (Optional) Deploy to Vercel/Railway/etc. and include the URL

---

## Tips

- Read GR-006 before you write code. It is the specification written by the customer.
- Get one item working end to end (feed → case → findings → human decision → record) before you
  go broad.
- Your users are compliance officers and legal experts. They want explainability, control and
  anything that adds trust; they are risk-averse.
- Dates, applicability facts and priorities can often be computed. Not everything needs a model.
- You are allowed to mock things. Say what you mocked in DECISIONS.md.
- We value clear thinking (DECISIONS.md) as much as clean code.
- Don't over-engineer. Ship something that works.
