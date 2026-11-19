# Regulatory feed

This folder stands in for a commercial regulatory-change service (horizon scanning). In
production such a service would push items to us through an API. Here, each item is one Markdown
file. Treat the folder as read-only input: your app reads it, it never writes to it.

All items are **fictional**. "Country A" means Germany and "Country B" means Austria. "Country C"
is a country where Lindenwerk has no entity, branch or employees. "European Union" items are
fictional EU texts. Nothing here describes real German, Austrian or EU law.

## Time

Items arrive over time. The date prefix of a file name is the day the item reaches you.
Your app should only "see" items dated on or before its current date, set by `FEED_AS_OF` in
`.env` (ISO date, e.g. `2027-02-01`).

To simulate a week passing, move `FEED_AS_OF` forward. The items span 5 January to 22 March 2027;
`FEED_AS_OF=2027-03-31` shows everything. The same date is "today" for anything time-dependent,
such as priorities and deadlines under GR-006 section 6.1.

## Format

```markdown
---
source_id: ctry-a-whistleblower-protection-amendment   # stable across versions
version: 2
title: Correction to the Act amending the Whistleblower Protection Act
issuer: Country A Federal Law Gazette
jurisdiction: Country A
publisher_type: official        # official | secondary (newsletters, association bulletins)
original_ref: null              # secondary items point to the official source: <source_id>@<version>
change_type: correction         # new | final_version | amendment | correction | withdrawal
status: final                   # draft | final | guidance | withdrawn
published_at: 2027-03-01
entry_into_force: 2027-06-01    # null = not stated; keep unknown dates explicitly unknown
application_date: 2027-06-01    # null = not stated
supersedes: ctry-a-whistleblower-protection-amendment@1
---

# Title

## § 1 ...
```

The header is metadata; the body is the text of the source. Clauses are the `##` headings
(`§ 1`, `1`, ...). Cite them by `source_id@version` plus clause.

`apps/web/src/lib/feed/` contains a typed loader for this format (`loadFeed`) that you can use,
change or replace.

## Adding your own items

Add files in the same format to build test cases and an eval set, for example in a separate folder
you point the loader at. At review we run your app against a second feed folder you have not seen,
in the same format, so do not hard-code anything about the items here.
