import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { FolderOpen, Inbox, Library } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    title: "Regulatory feed",
    description: "Incoming legal developments from the horizon-scanning provider",
    href: "/feed",
    icon: Inbox,
  },
  {
    title: "Change cases",
    description: "Assess applicability, obligations and policy gaps, and record decisions",
    href: "/cases",
    icon: FolderOpen,
  },
  {
    title: "Policy library",
    description: "Lindenwerk's currently effective policies and supporting documents",
    href: "/policies",
    icon: Library,
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Regulatory Change → Policy Impact</h1>
          <p className="text-muted-foreground">
            Help Lindenwerk&apos;s Compliance Officers turn a new regulation into an evidenced,
            human-decided policy change.
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
