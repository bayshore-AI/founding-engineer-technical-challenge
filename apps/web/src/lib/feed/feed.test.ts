import { describe, expect, test } from "bun:test";
import path from "node:path";
import { loadFeed } from "./load-feed";
import { parseFeedItem } from "./parse-feed-item";

const FEED_DIR = path.resolve(import.meta.dir, "../../../../../regulatory-feed");

const VALID_ITEM = `---
source_id: ctry-a-example-act
version: 2
title: Example Act
issuer: Country A Federal Law Gazette
jurisdiction: Country A
publisher_type: official
original_ref: null
change_type: correction
status: final
published_at: 2027-03-01
entry_into_force: 2027-06-01
application_date: null
supersedes: ctry-a-example-act@1
---

# Example Act

Intro text.

## § 1 Duty

Do the thing.

## 2 Entry into force

Soon.
`;

describe("parseFeedItem", () => {
  test("parses header, keeps unknown dates as null and splits clauses", () => {
    const result = parseFeedItem("2027-03-01_ctry-a-example-act_v2.md", VALID_ITEM);

    expect(result.isOk()).toBe(true);
    const item = result._unsafeUnwrap();
    expect(item.ref).toBe("ctry-a-example-act@2");
    expect(item.receivedAt).toBe("2027-03-01");
    expect(item.header.published_at).toBe("2027-03-01");
    expect(item.header.application_date).toBeNull();
    expect(item.clauses.map((c) => c.ref)).toEqual(["§ 1", "2"]);
    expect(item.clauses[0]?.text).toBe("Do the thing.");
  });

  test("rejects a file name without a date prefix", () => {
    const result = parseFeedItem("example.md", VALID_ITEM);
    expect(result._unsafeUnwrapErr().type).toBe("invalid_file_name");
  });

  test("rejects an invalid header value", () => {
    const result = parseFeedItem(
      "2027-03-01_example.md",
      VALID_ITEM.replace("status: final", "status: in_force"),
    );
    expect(result._unsafeUnwrapErr().type).toBe("invalid_header");
  });
});

describe("loadFeed", () => {
  test("loads every item in the provided feed", async () => {
    const result = await loadFeed({ dir: FEED_DIR, asOf: "9999-12-31" });
    expect(result._unsafeUnwrap()).toHaveLength(12);
  });

  test("only returns items received on or before the as-of date", async () => {
    const items = (await loadFeed({ dir: FEED_DIR, asOf: "2027-01-18" }))._unsafeUnwrap();
    expect(items.map((i) => i.receivedAt)).toEqual(["2027-01-05", "2027-01-12", "2027-01-18"]);
  });

  test("fails with read_failed for a missing folder", async () => {
    const result = await loadFeed({ dir: "/does/not/exist", asOf: "2027-01-01" });
    expect(result._unsafeUnwrapErr().type).toBe("read_failed");
  });
});
