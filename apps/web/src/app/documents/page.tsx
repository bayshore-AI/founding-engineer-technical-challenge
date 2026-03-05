export default function DocumentsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Documents</h1>
        <p className="text-muted-foreground text-sm">
          Upload, browse, and manage policy documents.
        </p>
      </div>

      {/* TODO: Implement document management here.
       *
       * Must-haves:
       * - Upload interface for PDF files (drag-and-drop or file picker)
       * - List of ingested documents with metadata
       * - Trigger ingestion pipeline (parse → chunk → extract → graph)
       * - Status indicators for processing state
       *
       * Stretch goals:
       * - Document viewer showing the full document content
       * - "Related documents" sidebar based on graph connections
       * - Click a paragraph → highlight related content in other docs
       */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">Document management goes here</p>
          <p className="mt-1 text-sm">
            Implement PDF upload, ingestion pipeline, and document browsing.
          </p>
        </div>
      </div>
    </div>
  );
}
