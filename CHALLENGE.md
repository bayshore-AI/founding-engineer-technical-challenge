# Engineering Take-Home: Regulatory Change → Policy Impact

## Why this challenge

You will build a product that tells a compliance team which of their internal policies a new
regulation affects, where the gaps are, and proves it: **regulation → obligation → policy**. You
have 2–3 days and should lean heavily on AI coding tools.

Bayshore builds an agentic compliance platform for regulated enterprises: banks, insurers, pharma,
defense, industrials. They need reliability, deterministic behavior where possible, and explainable,
traceable decision making. The product must withstand an audit and run at scale in regulated
environments for risky decisions.

## The bigger picture

Your work is the upstream half of a chain whose downstream half Bayshore already runs at customers.
Read this section to make good product decisions; you build only the first three rows.

| Stage | What it is | Example (Lindenwerk) | Who covers it |
| --- | --- | --- | --- |
| Regulation | A law or supervisory text | Country B Public Contracts Integrity Act, § 2 | **Your challenge** |
| Obligation | A concrete duty it creates | No benefit of any value to tender evaluators while a tender is open | **Your challenge** |
| Policy | The company's internal rule that meets the duty | GR-001 section III.A and the local thresholds list (Austria: 35 EUR) | **Your challenge** |
| Rule | The policy turned into executable logic | Business meal for a public official in Austria above threshold → Compliance approval | Bayshore today, written by our legal engineers. Out of scope. |
| Request | Someone wants to do something | Invite two officials of a state-owned customer to a factory visit with dinner | Bayshore today |
| Decision | Allowed, and on what conditions | Rejected: tender open | Bayshore today |
| Evidence | Facts, sources and approvals on record | Audit trail of the request | Bayshore today |
| Monitoring and assurance | Re-checks and monitoring over time | Periodic review, internal audit | We are building that currently |

Today Bayshore sits at request → decision → evidence. An employee asks to do something, an agent
gathers the facts, rules derived from the customer's policies decide which checks and approvals
apply, a human signs off, and everything is recorded. Those rules are only as good as the policies
behind them, and the policies only as good as the obligations they cover. There is a whole industry
dealing with so-called "regulatory horizon scanning", "gap analysis" and "policy management". We
will build that as a feature in our risk and compliance platform, to close the loop all the way
from regulation to the business processes.

### Who uses what you build, and for what

| User | Their job (GR-006) | What they need from your product |
| --- | --- | --- |
| Regional or Functional Compliance Officer (primary) | Case lead: reviews sources, confirms applicability, reviews gaps and amendments, accepts closure evidence | A triaged inbox, findings they can trust at a glance, a record of their decisions |
| Chief Compliance Officer (CCO) | Owns the process and the change register; coordinates coverage; escalates to the CFO | An overview of open cases, priorities and deadlines across regions |
| Policy owner | Maintains assigned policies; drafts revisions | Precise, cited gaps and a proposed amendment, not a 40-page summary |
| CFO (or the Management Board for reserved matters) | Approves policy revisions; receives escalations | The exact revision to approve, why it is needed, and what is urgent |
| Internal audit and external auditors | Check that regulatory change is handled properly | Per item: who assessed it, when, the outcome and the evidence |
| Bayshore legal engineer (at some point automated) | Update the rules when a policy changes | Approved policy changes, each linked to its obligation and clause |

### Why it matters

- **Real consequences.** Missing a change, or assessing it late, is a classic audit and supervisory
  finding.
- **Where the value is.** Regulatory content providers already sell feeds and summaries; we don't
  compete there. The value is connecting a change to this company's own policies, with proof.
- **Why Bayshore cares.** It closes our loop: a regulatory change should affect the relevant
  business processes directly, without months of work and millions spent on consultants.

### Out of scope

Translating policies into executable rules or processes. That runs on our own ruleset engine, which
you don't have. Your work ends at an approved, evidenced policy change. Design that output so
someone downstream can act on it without re-reading the regulation.

## The problem

**The company: Lindenwerk Technologies AG** (fictional). A German technology group headquartered
in Stuttgart with about 25,000 employees. It develops and manufactures power semiconductors,
sensors and control chips for automotive, industrial, energy and electronics customers, with
research and manufacturing in Germany and Austria and operations across Europe, the Americas,
Greater China, Asia Pacific and Japan. It sells directly and through distributors and sales agents,
and deals with customs and certification authorities, permit officials, public universities and
state-owned customers. The company profile (sent by email) has the full facts. In the feed,
"Country A" means Germany and "Country B" means Austria.

**The process: GR-006 "Regulatory change and policy management"** (sent by email). This is
Lindenwerk's own rule for handling regulatory change, written for humans doing the work manually.
Read it as the specification of what your product should assist, end to end. It defines the roles,
the decisions that must stay human (section 3), the case record, the applicability outcomes, the
five coverage findings (covered, partial, conflicting, missing, uncertain), priorities and versioning.

Today the Compliance Officer reads newsletters and gazettes, judges relevance by gut feel, searches
PDFs for affected sections, writes a gap memo, emails policy owners and chases them. Changes get
missed, assessments lag by weeks, and nobody can prove to the auditor that change X was assessed, by
whom, on what basis.

**The full target journey** (mapped to GR-006):

1. **Detect** (section 4.1): new regulatory items arrive from feeds. We are not going to build legal
   horizon scanning ourselves; there are providers for that.
2. **Triage (gap analysis)** (4.2, 5.1): is this item relevant to Lindenwerk? Jurisdiction, entity,
   activity, size, dates. Duplicates, secondary sources, drafts vs. final versions, corrections.
3. **Interpret (gap analysis)** (5.1): extract the concrete obligations from the text.
4. **Map (gap analysis)** (5.2): find the internal policy sections each obligation touches.
5. **Gap analysis** (5.2): per obligation, covered / partial / conflicting / missing / uncertain,
   citing both texts.
6. **Propose (policy management)** (7.1): draft a policy change or amendment for each gap.
7. **Decide (policy management)** (6, 7.2): the Compliance Officer accepts, edits or rejects each
   finding and assigns it to a policy owner with a due date. The CFO, or the Management Board for
   reserved matters, approves the exact revision, with an effective date.
8. **Prove (audit)** (8.3): for any regulatory item, the auditor sees who assessed what, when, on
   which evidence, and which policies changed.

## What we give you

| What | Where | What it holds |
| --- | --- | --- |
| Regulatory feed | [`regulatory-feed/`](regulatory-feed/README.md) | 12 fictional regulatory items as Markdown files, arriving between 5 January and 22 March 2027. Includes noise, a draft and its final version, a secondary source, and a correction. |
| Sample labels | [`labels/sample.json`](labels/sample.json) | Expected outcomes for 3 feed items, so you can calibrate. We keep the labels for the others. |
| Company profile, GR-006, policy library | By email → put them in [`policies/`](policies/README.md) | The facts about Lindenwerk, its regulatory change process, and 14 compliance documents (PDF). |
| OpenAI API key | By email | For the models in your product. |
| Starter app | This repo | Next.js + Bun + TypeScript monorepo with a typed feed loader and a feed viewer. See [README.md](README.md). |

The feed is a folder, not an API, so you can test and simulate easily: `FEED_AS_OF` sets "today",
and moving it forward makes new items arrive. You can add your own items in the same format. At
review we also run your app against a second feed you have not seen.

## The assignment

Build a working product that takes the Compliance Officer from "a regulatory item arrived" to "an
evidenced, human-decided policy change", end to end, on the data above. The vision above is very
ambitious for 2–3 days, and choosing what to prioritise, what to mock etc. is up to you. We expect
you to:

1. Choose the slice that gives the Compliance Officer the most value and justify it.
2. Plan it and break it down.
3. Build it end to end (UI, backend, AI pipeline, persistence), running locally with one command.
   You are of course allowed to use agents of any sort.
4. Record a video as a demo.
5. Explain your decisions, and say what you would build next and why.

**Do not build a crawler or a regulatory content library.** The feed is given. The value we care
about sits between the regulation and the company's own policies.

## Non-negotiables

- **It runs.** One command after `bun install` and adding your `.env`. We will run it.
- **Every finding cites its evidence:** the exact passage of the regulation and the exact policy
  section, or an explicit "no matching clause found". A fabricated quote is the worst bug in our
  domain, so test for it.
- **A human decides.** No finding is closed and no policy changes without an explicit human action,
  recorded with who, when and why.
- **Auditable.** For any regulatory item, we can reconstruct what happened, which policies changed
  and why. Converting unstructured input into structured data can help achieve better
  explainability.

## Deliverables

Everything lives in one Git repository.

| File | Content |
| --- | --- |
| Code, tests, `README.md` | Setup in under 5 minutes. |
| `DECISIONS.md` | Short log of key decisions (template provided). |
| Recording | Demo what you have built. |
| `NEXT.md` | The next 3 things you would build, with reasons (template provided). |

## Others

- **AI tools** are explicitly allowed.
- **Stack:** we use TypeScript, Bun, Next.js, Postgres, Redis and Temporal. The starter follows our
  conventions (see README.md).
- **Git history:** commit as you go, don't squash.
- **Questions:** if you have questions, reach out to Erik.
