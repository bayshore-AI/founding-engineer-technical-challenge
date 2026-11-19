import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regulatory Change → Policy Impact",
  description: "Regulatory change and policy management for Lindenwerk",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
