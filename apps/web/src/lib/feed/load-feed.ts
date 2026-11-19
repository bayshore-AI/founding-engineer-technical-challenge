import type { FeedItem } from "@repo/domain";
import { Result, ResultAsync } from "neverthrow";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { isFeedFileName, parseFeedItem } from "./parse-feed-item";
import type { FeedParseError } from "./parse-feed-item";

export type FeedError =
  | { type: "read_failed"; message: string }
  | { type: "invalid_items"; message: string; issues: FeedParseError[] };

export interface LoadFeedOptions {
  /** Absolute path of the feed folder */
  dir: string;
  /** Only items received on or before this ISO date are returned */
  asOf: string;
}

/**
 * Reads every feed file in `dir`, validates it, and returns the items received on or before
 * `asOf`, oldest first. Fails if any file in the folder is invalid, so broken test items surface.
 */
export function loadFeed({ dir, asOf }: LoadFeedOptions): ResultAsync<FeedItem[], FeedError> {
  return ResultAsync.fromPromise(readdir(dir), (error) => readFailed(dir, error))
    .andThen((fileNames) => {
      const feedFiles = fileNames.filter(isFeedFileName).sort();
      return ResultAsync.combine(
        feedFiles.map((fileName) =>
          ResultAsync.fromPromise(readFile(path.join(dir, fileName), "utf8"), (error) =>
            readFailed(fileName, error),
          ).map((content) => ({ fileName, content })),
        ),
      );
    })
    .andThen((files) =>
      Result.combineWithAllErrors(
        files.map(({ fileName, content }) => parseFeedItem(fileName, content)),
      ).mapErr(
        (issues): FeedError => ({
          type: "invalid_items",
          message: `${issues.length} invalid feed file(s)`,
          issues,
        }),
      ),
    )
    .map((items) =>
      items
        .filter((item) => item.receivedAt <= asOf)
        .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt) || a.ref.localeCompare(b.ref)),
    );
}

function readFailed(target: string, error: unknown): FeedError {
  return { type: "read_failed", message: `Could not read ${target}: ${String(error)}` };
}
