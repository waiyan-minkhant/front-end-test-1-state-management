"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { PlayerList } from "@/components/players/PlayerList";
import { TeamList } from "@/components/teams/TeamList";
import { Separator } from "@/components/ui/separator";

export function HomeView() {
  return (
    <AuthGuard>
      <AppShell>
        <TeamList />
        <Separator />
        <PlayerList />
      </AppShell>
    </AuthGuard>
  );
}
