export default function PoliciesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Policy library</h1>
        <p className="text-muted-foreground text-sm">
          Lindenwerk&apos;s currently effective policies, rules and supporting documents.
        </p>
      </div>

      {/* TODO: The documents arrive by email (PDF). Put them in /policies at the repo root.
       *
       * How you ingest, structure, version and cite them is up to you. GR-006 5.2 requires
       * references to the exact document, version and section.
       */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">Policy library goes here</p>
          <p className="mt-1 text-sm">See /policies/README.md for where to put the documents.</p>
        </div>
      </div>
    </div>
  );
}
