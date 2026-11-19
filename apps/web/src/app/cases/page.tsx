export default function CasesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Change cases</h1>
        <p className="text-muted-foreground text-sm">
          One case per potentially relevant development (GR-006 section 4.2).
        </p>
      </div>

      {/* TODO: This is where your product starts. See CHALLENGE.md.
       *
       * GR-006 describes the manual process your product should assist end to end:
       * register → applicability → obligations → policy coverage → amendment → approval → record.
       * Decide which part gives the Compliance Officer the most value and build that well.
       */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">Your product goes here</p>
          <p className="mt-1 text-sm">Start from the feed, end at a decided, evidenced case.</p>
        </div>
      </div>
    </div>
  );
}
