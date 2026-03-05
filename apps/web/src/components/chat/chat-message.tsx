"use client";

import type { UIMessage } from "ai";
import { isTextUIPart } from "ai";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {message.parts
          .filter(isTextUIPart)
          .map((part, i) => (
            <div key={i} className="prose prose-sm dark:prose-invert max-w-none">
              {/* TODO: Replace with react-markdown for proper rendering.
               *
               * In our codebase we use:
               *   <ReactMarkdown remarkPlugins={[remarkGfm]}>
               *     {part.text}
               *   </ReactMarkdown>
               *
               * Also consider adding citation rendering here.
               * When the assistant cites a document, render it as a
               * clickable reference that links to the document viewer.
               */}
              <p className="whitespace-pre-wrap">{part.text}</p>
            </div>
          ))}

        {/* TODO: Render tool invocation results here.
         *
         * Filter message.parts for tool-call parts and display:
         * - Search results with source documents
         * - Graph traversal results
         * - Any other tool outputs
         *
         * In our codebase we use isToolUIPart() to detect these.
         */}
      </div>
    </div>
  );
}
