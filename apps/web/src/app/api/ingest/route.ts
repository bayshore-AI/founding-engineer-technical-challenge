import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const log = logger("Ingest API");

// ─── POST /api/ingest ────────────────────────────────────────────────────────
// Accepts PDF file uploads and triggers the ingestion pipeline.

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }

    log.info("Received PDF for ingestion", {
      fileName: file.name,
      fileSize: file.size,
    });

    // TODO: Implement the ingestion pipeline:
    //
    // 1. Parse the PDF → extract raw text (consider: pdf-parse, pdfjs-dist, or similar)
    // 2. Chunk the text → split into meaningful sections (by heading, paragraph, or fixed size)
    // 3. Store chunks with stable IDs (content-hash or sequential)
    // 4. Extract entities and relationships → build graph nodes and edges
    //    - Use LLM for entity/relation extraction, or
    //    - Use NLP heuristics (keyword matching, section cross-references)
    // 5. Store graph data
    // 6. (Optional) Generate embeddings for vector similarity
    //
    // Return the created document with its metadata.

    return NextResponse.json(
      {
        error: "Not implemented",
        hint: "Implement PDF parsing, chunking, and graph extraction here",
      },
      { status: 501 },
    );
  } catch (error) {
    log.error("Ingestion failed", { error: String(error) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/ingest ─────────────────────────────────────────────────────────
// Returns the list of ingested documents.

export async function GET() {
  // TODO: Return all documents from your store.
  //
  // Response should match the Document schema from @repo/domain:
  // { documents: Document[] }

  return NextResponse.json({ documents: [] });
}
