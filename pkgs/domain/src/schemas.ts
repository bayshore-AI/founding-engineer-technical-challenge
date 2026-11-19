import { z } from "zod";

// ─── Regulatory feed ─────────────────────────────────────────────────────────
// Shape of one item in /regulatory-feed (see regulatory-feed/README.md).

/** ISO date (YYYY-MM-DD). YAML parses unquoted dates as Date objects, so accept both. */
const IsoDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)"),
);

export const PublisherTypeSchema = z.enum(["official", "secondary"]);
export type PublisherType = z.infer<typeof PublisherTypeSchema>;

export const ChangeTypeSchema = z.enum([
  "new",
  "final_version",
  "amendment",
  "correction",
  "withdrawal",
]);
export type ChangeType = z.infer<typeof ChangeTypeSchema>;

export const SourceStatusSchema = z.enum(["draft", "final", "guidance", "withdrawn"]);
export type SourceStatus = z.infer<typeof SourceStatusSchema>;

/** Reference to one version of a source: `<source_id>@<version>`. */
export const SourceRefSchema = z.string().regex(/^[a-z0-9-]+@\d+$/, "Expected <source_id>@<version>");
export type SourceRef = z.infer<typeof SourceRefSchema>;

export const FeedItemHeaderSchema = z.object({
  source_id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().positive(),
  title: z.string().min(1),
  issuer: z.string().min(1),
  jurisdiction: z.string().min(1),
  publisher_type: PublisherTypeSchema,
  /** Secondary items point to the official source they summarize. */
  original_ref: SourceRefSchema.nullable(),
  change_type: ChangeTypeSchema,
  status: SourceStatusSchema,
  published_at: IsoDateSchema,
  /** null = not stated in the source. Keep unknown dates explicitly unknown (GR-006 4.2). */
  entry_into_force: IsoDateSchema.nullable(),
  application_date: IsoDateSchema.nullable(),
  supersedes: SourceRefSchema.nullable(),
});
export type FeedItemHeader = z.infer<typeof FeedItemHeaderSchema>;

export const ClauseSchema = z.object({
  /** Clause label as written in the source, e.g. "§ 2" or "1" */
  ref: z.string(),
  /** Full heading line without the leading "## " */
  heading: z.string(),
  text: z.string(),
});
export type Clause = z.infer<typeof ClauseSchema>;

export const FeedItemSchema = z.object({
  /** `<source_id>@<version>` */
  ref: SourceRefSchema,
  fileName: z.string(),
  /** Date the item reaches the company: the file name's date prefix */
  receivedAt: IsoDateSchema,
  header: FeedItemHeaderSchema,
  /** Full Markdown body (without the header) */
  body: z.string(),
  clauses: z.array(ClauseSchema),
});
export type FeedItem = z.infer<typeof FeedItemSchema>;

// ─── GR-006 vocabulary ───────────────────────────────────────────────────────
// Outcome values defined by Lindenwerk's GR-006 "Regulatory change and policy management".

/** GR-006 5.1 */
export const ApplicabilitySchema = z.enum(["applicable", "not_applicable", "needs_clarification"]);
export type Applicability = z.infer<typeof ApplicabilitySchema>;

/** GR-006 5.2 */
export const CoverageFindingSchema = z.enum([
  "covered",
  "partial",
  "conflicting",
  "missing",
  "uncertain",
]);
export type CoverageFinding = z.infer<typeof CoverageFindingSchema>;

/** GR-006 6.1 */
export const PrioritySchema = z.enum(["high", "standard"]);
export type Priority = z.infer<typeof PrioritySchema>;
