"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./chat-message";

export function ChatInterface() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/chat",
    });
  }, []);

  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput("");

    try {
      await sendMessage({ text: messageText });
    } catch {
      setInput(messageText);
    }
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages area */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="mx-auto max-w-3xl space-y-6 p-6">
          {messages.length === 0 && <WelcomeScreen />}

          {messages.map((message: UIMessage) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && messages.at(-1)?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="bg-muted size-8 shrink-0 rounded-full" />
              <div className="bg-muted animate-pulse rounded-lg px-4 py-3">
                <span className="text-muted-foreground text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your policies..."
            className="min-h-10 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="button"
            size="icon"
            disabled={!input.trim() || isLoading}
            className={cn("shrink-0", isLoading && "opacity-50")}
            onClick={() => void handleSend()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold">Policy Assistant</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        Ask questions about your compliance policies. Answers are grounded in the
        knowledge graph built from your uploaded documents.
      </p>
      <div className="mt-6 grid gap-2 text-sm">
        <SuggestionChip text="What are the gift acceptance thresholds?" />
        <SuggestionChip text="Which policies reference public officials?" />
        <SuggestionChip text="Are there conflicts between anti-corruption and entertainment rules?" />
      </div>
    </div>
  );
}

function SuggestionChip({ text }: { text: string }) {
  return (
    <button className="text-muted-foreground hover:bg-accent rounded-lg border px-4 py-2 text-left transition-colors hover:text-foreground">
      {text}
    </button>
  );
}
