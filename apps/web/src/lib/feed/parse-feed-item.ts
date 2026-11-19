import { FeedItemHeaderSchema } from "@repo/domain";
import type { Clause, FeedItem } from "@repo/domain";
import { err, ok } from "neverthrow";
import type { Result } from "neverthrow";
import { parse as parseYaml } from "yaml";

export interface FeedParseError {
  type: "invalid_file_name" | "missing_header" | "invalid_header";
  fileName: string;
  message: string;
}

/** `2027-01-18_some-slug.md` → received on 2027-01-18 */
const FILE_NAME_PATTERN = /^(\d{4}-\d{2}-\d{2})_[a-z0-9_-]+\.md$/;
const HEADER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const CLAUSE_REF_PATTERN = /^(§\s*\d+[a-z]?|Article\s+\d+[a-z]?|\d+(?:\.\d+)*)/;

// ─── Public API ──────────────────────────────────────────────────────────────

export function isFeedFileName(fileName: string): boolean {
  return FILE_NAME_PATTERN.test(fileName);
}

/** Parses one feed file (header + Markdown body) into a validated FeedItem. */
export function parseFeedItem(fileName: string, content: string): Result<FeedItem, FeedParseError> {
  const receivedAt = FILE_NAME_PATTERN.exec(fileName)?.[1];
  if (!receivedAt) {
    return err({
      type: "invalid_file_name",
      fileName,
      message: "Expected YYYY-MM-DD_<slug>.md",
    });
  }

  const match = HEADER_PATTERN.exec(content);
  const rawHeader = match?.[1];
  const body = match?.[2];
  if (rawHeader === undefined || body === undefined) {
    return err({ type: "missing_header", fileName, message: "No --- header block found" });
  }

  let yaml: unknown;
  try {
    yaml = parseYaml(rawHeader);
  } catch (error) {
    return err({ type: "invalid_header", fileName, message: `Invalid YAML: ${String(error)}` });
  }

  const header = FeedItemHeaderSchema.safeParse(yaml);
  if (!header.success) {
    return err({
      type: "invalid_header",
      fileName,
      message: header.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    });
  }

  return ok({
    ref: `${header.data.source_id}@${header.data.version}`,
    fileName,
    receivedAt,
    header: header.data,
    body: body.trim(),
    clauses: splitClauses(body),
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Splits the body at `## ` headings. Text before the first heading is not a clause. */
function splitClauses(body: string): Clause[] {
  const clauses: Clause[] = [];
  let current: { heading: string; lines: string[] } | undefined;

  for (const line of body.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      if (current) clauses.push(toClause(current.heading, current.lines));
      current = { heading: line.slice(3).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) clauses.push(toClause(current.heading, current.lines));

  return clauses;
}

function toClause(heading: string, lines: string[]): Clause {
  const ref = CLAUSE_REF_PATTERN.exec(heading)?.[1]?.replace(/§\s*/, "§ ") ?? heading;
  return { ref, heading, text: lines.join("\n").trim() };
}
