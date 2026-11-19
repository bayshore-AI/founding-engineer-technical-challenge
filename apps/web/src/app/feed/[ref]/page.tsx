import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedItemBadges } from "@/components/feed/feed-item-badges";
import { getFeedConfig, loadFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";

interface FeedItemPageProps {
  params: Promise<{ ref: string }>;
}

export default async function FeedItemPage({ params }: FeedItemPageProps) {
  const ref = decodeURIComponent((await params).ref);
  const { dir, asOf } = getFeedConfig();
  const items = (await loadFeed({ dir, asOf })).unwrapOr([]);
  const item = items.find((candidate) => candidate.ref === ref);

  if (!item) notFound();

  const { header } = item;
  const dates = [
    ["Published", header.published_at],
    ["Entry into force", header.entry_into_force ?? "not stated"],
    ["Application date", header.application_date ?? "not stated"],
    ["Supersedes", header.supersedes ?? "–"],
    ["Original source", header.original_ref ?? "–"],
  ] as const;

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b px-6 py-4">
        <Link href="/feed" className="text-muted-foreground text-xs hover:underline">
          ← Regulatory feed
        </Link>
        <h1 className="text-lg font-semibold">{header.title}</h1>
        <p className="text-muted-foreground text-sm">
          {header.issuer} · {item.ref}
        </p>
        <FeedItemBadges header={header} />
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-6">
        <dl className="grid max-w-xl grid-cols-[10rem_1fr] gap-y-1 text-sm">
          {dates.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {/* TODO: This is the raw source. What does the Compliance Officer need next? */}
        <div className="space-y-4">
          {item.clauses.length === 0 ? (
            <pre className="whitespace-pre-wrap text-sm">{item.body}</pre>
          ) : (
            item.clauses.map((clause) => (
              <section key={clause.heading} className="space-y-1">
                <h2 className="text-sm font-semibold">{clause.heading}</h2>
                <p className="text-sm whitespace-pre-wrap">{clause.text}</p>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
