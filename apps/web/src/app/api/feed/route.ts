import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeedConfig, loadFeed } from "@/lib/feed";
import { logger } from "@/lib/logger";

const log = logger("Feed API");

const QuerySchema = z.object({
  /** Optional override of FEED_AS_OF, e.g. ?asOf=2027-02-01 */
  asOf: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// ─── GET /api/feed ───────────────────────────────────────────────────────────
// Returns the feed items that have arrived by the as-of date.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = QuerySchema.safeParse({ asOf: searchParams.get("asOf") ?? undefined });

  if (!query.success) {
    return NextResponse.json(
      { error: "Invalid query", details: query.error.issues },
      { status: 400 },
    );
  }

  const config = getFeedConfig();
  const asOf = query.data.asOf ?? config.asOf;
  const result = await loadFeed({ dir: config.dir, asOf });

  return result.match(
    (items) => NextResponse.json({ asOf, items }),
    (error) => {
      log.error("Loading the feed failed", { error });
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    },
  );
}
