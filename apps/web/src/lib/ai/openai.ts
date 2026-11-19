import { createOpenAI } from "@ai-sdk/openai";

/**
 * OpenAI provider for the Vercel AI SDK (`ai`). Use it with generateText / streamText, e.g.
 *
 *   import { generateText } from "ai";
 *   const { text } = await generateText({ model: openai(OPENAI_MODEL), prompt });
 *
 * For structured output, validate the model's result with a Zod schema before you trust it.
 */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";
