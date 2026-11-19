import { Badge } from "@repo/ui/components/ui/badge";
import type { FeedItemHeader } from "@repo/domain";

interface FeedItemBadgesProps {
  header: FeedItemHeader;
}

export function FeedItemBadges({ header }: FeedItemBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <Badge variant="outline">{header.jurisdiction}</Badge>
      <Badge variant={header.status === "final" ? "default" : "secondary"}>{header.status}</Badge>
      <Badge variant="secondary">{header.change_type.replace("_", " ")}</Badge>
      {header.publisher_type === "secondary" && <Badge variant="destructive">secondary source</Badge>}
    </div>
  );
}
