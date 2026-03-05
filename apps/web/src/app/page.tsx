import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { FileText, GitBranch, MessageSquare } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    title: "Documents",
    description: "Upload and browse policy documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Knowledge Graph",
    description: "Visualize relationships between policies",
    href: "/graph",
    icon: GitBranch,
  },
  {
    title: "Chat",
    description: "Ask questions about your policies using Graph-RAG",
    href: "/chat",
    icon: MessageSquare,
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Policy Graph Explorer</h1>
          <p className="text-muted-foreground">
            Upload compliance policy documents, explore their relationships through a knowledge
            graph, and chat with your policies using Graph-RAG.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <feature.icon className="text-muted-foreground mb-2 size-8" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
