import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Policy Chat</h1>
        <p className="text-muted-foreground text-sm">
          Ask questions about your policy documents. Answers are grounded in the knowledge graph.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
