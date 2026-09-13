import type { ReactNode } from "react";
import { StorageNotice } from "@/components/feedback/StorageNotice";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:py-8"
      >
        <StorageNotice />
        {children}
      </main>
    </div>
  );
}
