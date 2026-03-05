import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import type { UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const log = logger("Chat API");

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Request validation ──────────────────────────────────────────────────────

const ChatRequestSchema = z.object({
  messages: z.array(z.any()) as z.ZodType<UIMessage[]>,
});

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = ChatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { messages: uiMessages } = parsed.data;

  try {
    // Convert UI messages to model messages for the AI SDK
    const messages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model: openai(process.env.OPENAI_MODEL ?? "gpt-4o"),
          system: buildSystemPrompt(),
          messages,
          // TODO: Add tools for Graph-RAG retrieval.
          //
          // Follow this pattern (from our internal codebase):
          //
          // tools: {
          //   search_policies: {
          //     description: "Search policy documents using the knowledge graph",
          //     parameters: z.object({
          //       query: z.string().describe("The search query"),
          //     }),
          //     execute: async ({ query }) => {
          //       // 1. Use graph structure for retrieval (not just vector similarity)
          //       // 2. Return relevant chunks with citations
          //       // 3. Include graph context (related nodes/edges)
          //     },
          //   },
          // },
          // toolChoice: "auto",
        });

        result.consumeStream();
        writer.merge(result.toUIMessageStream());
      },
      onFinish: async ({ responseMessage }) => {
        // TODO: Optionally persist messages to your storage layer.
        //
        // In our codebase we extract tool results from responseMessage.parts
        // and store them alongside the message for audit/replay.
        log.info("Chat response completed", {
          messageId: responseMessage.id,
          partCount: responseMessage.parts.length,
        });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    log.error("Chat stream failed", { error: String(error) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  // TODO: Build a system prompt that includes:
  // - Role description (policy assistant)
  // - Instructions to use the search tool for grounding answers
  // - Citation format requirements
  // - Graph-awareness instructions
  return `You are a compliance policy assistant. You help users understand and navigate corporate compliance policies.

When answering questions:
- Ground your answers in the actual policy documents
- Cite specific documents and sections
- If you're unsure, say so rather than guessing
- Highlight any cross-references between policies`;
}
