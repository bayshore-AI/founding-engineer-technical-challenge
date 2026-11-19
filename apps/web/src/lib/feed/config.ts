import path from "node:path";
import { z } from "zod";

/** Used when FEED_AS_OF is not set: the first two weeks of the feed are visible. */
export const DEFAULT_FEED_AS_OF = "2027-01-15";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export interface FeedConfig {
  dir: string;
  asOf: string;
}

/**
 * Feed location and the simulated "today".
 * - FEED_DIR: absolute or relative to apps/web (default: the repo's /regulatory-feed)
 * - FEED_AS_OF: ISO date; items dated after it have not arrived yet
 */
export function getFeedConfig(): FeedConfig {
  const asOf = IsoDate.safeParse(process.env.FEED_AS_OF);
  return {
    dir: path.resolve(process.cwd(), process.env.FEED_DIR ?? "../../regulatory-feed"),
    asOf: asOf.success ? asOf.data : DEFAULT_FEED_AS_OF,
  };
}
