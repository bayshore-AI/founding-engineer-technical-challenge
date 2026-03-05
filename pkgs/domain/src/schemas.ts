import { z } from "zod";

// ─── Document ────────────────────────────────────────────────────────────────

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  fileName: z.string(),
  /** Total number of chunks extracted from this document */
  chunkCount: z.number().int().nonneg(),
  createdAt: z.string().datetime(),
});

export type Document = z.infer<typeof DocumentSchema>;

// ─── Chunk ───────────────────────────────────────────────────────────────────

export const ChunkSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  /** Section or heading this chunk belongs to */
  section: z.string().optional(),
  /** The raw text content */
  content: z.string(),
  /** Position within the document (0-indexed) */
  index: z.number().int().nonneg(),
});

export type Chunk = z.infer<typeof ChunkSchema>;

// ─── Graph ───────────────────────────────────────────────────────────────────

export const GraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** e.g. "policy", "concept", "entity", "requirement", "section" */
  type: z.string(),
  /** Source document IDs this node was extracted from */
  documentIds: z.array(z.string()),
  /** Arbitrary metadata the candidate may add */
  metadata: z.record(z.unknown()).optional(),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;

export const GraphEdgeSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  /** e.g. "references", "requires", "conflicts_with", "related_to" */
  relationship: z.string(),
  /** Optional weight or confidence score */
  weight: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type GraphEdge = z.infer<typeof GraphEdgeSchema>;

export const GraphSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

export type Graph = z.infer<typeof GraphSchema>;

// ─── Chat ────────────────────────────────────────────────────────────────────

export const CitationSchema = z.object({
  documentId: z.string(),
  documentTitle: z.string(),
  section: z.string().optional(),
  chunkId: z.string().optional(),
  /** Snippet of the source text */
  excerpt: z.string().optional(),
});

export type Citation = z.infer<typeof CitationSchema>;
