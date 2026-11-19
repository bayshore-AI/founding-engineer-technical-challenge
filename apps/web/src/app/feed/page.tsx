import Link from "next/link";
import { FeedItemBadges } from "@/components/feed/feed-item-badges";
import { getFeedConfig, loadFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { dir, asOf } = getFeedConfig();
  const result = await loadFeed({ dir, asOf });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Regulatory feed</h1>
        <p className="text-muted-foreground text-sm">
          Items received up to <span className="font-medium">{asOf}</span> (FEED_AS_OF). This is
          raw input from the horizon-scanning provider, not yet assessed.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {result.match(
          (items) =>
            items.length === 0 ? (
              <p className="text-muted-foreground text-sm">No items received yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr className="border-b">
                    <th className="py-2 pr-4 font-medium">Received</th>
                    <th className="py-2 pr-4 font-medium">Title</th>
                    <th className="py-2 pr-4 font-medium">Issuer</th>
                    <th className="py-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.ref} className="border-b align-top">
                      <td className="py-2 pr-4 whitespace-nowrap">{item.receivedAt}</td>
                      <td className="py-2 pr-4">
                        <Link
                          href={`/feed/${encodeURIComponent(item.ref)}`}
                          className="hover:underline"
                        >
                          {item.header.title}
                        </Link>
                        <div className="text-muted-foreground text-xs">{item.ref}</div>
                      </td>
                      <td className="py-2 pr-4">{item.header.issuer}</td>
                      <td className="py-2">
                        <FeedItemBadges header={item.header} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ),
          (error) => (
            <div className="text-destructive text-sm">
              <p className="font-medium">Could not load the feed: {error.message}</p>
              {error.type === "invalid_items" && (
                <ul className="mt-2 list-disc pl-5">
                  {error.issues.map((issue) => (
                    <li key={issue.fileName}>
                      {issue.fileName}: {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
