"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import type { Team } from "@/domain/teams/types";
import { usePlayers } from "@/logic/hooks/usePlayers";
import { useTeams } from "@/logic/hooks/useTeams";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeleteTeamModal } from "@/components/teams/DeleteTeamModal";
import { TeamCard } from "@/components/teams/TeamCard";
import { TeamEmptyState } from "@/components/teams/TeamEmptyState";
import { TeamFormModal } from "@/components/teams/TeamFormModal";

export function TeamList() {
  const { teams, error } = useTeams();
  const { catalog, ensureCatalog } = usePlayers();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);

  const playersById = useMemo(
    () => new Map(catalog.map((player) => [player.id, player])),
    [catalog],
  );

  useEffect(() => {
    ensureCatalog();
  }, [ensureCatalog]);

  return (
    <section aria-labelledby="teams-heading" className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="teams-heading" className="text-xl font-semibold">
            Teams
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, and delete teams. Assigned players are released when a
            team is deleted.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            ensureCatalog();
            setCreateOpen(true);
          }}
        >
          <PlusIcon aria-hidden />
          Create team
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {teams.length === 0 ? (
        <TeamEmptyState
          onCreate={() => {
            ensureCatalog();
            setCreateOpen(true);
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              players={team.playerIds
                .map((id) => playersById.get(id))
                .filter((player) => player != null)}
              onEdit={() => {
                ensureCatalog();
                setEditingTeam(team);
              }}
              onDelete={() => setDeletingTeam(team)}
            />
          ))}
        </div>
      )}

      <TeamFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <TeamFormModal
        open={Boolean(editingTeam)}
        team={editingTeam}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTeam(undefined);
          }
        }}
      />
      <DeleteTeamModal
        team={deletingTeam}
        open={Boolean(deletingTeam)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTeam(null);
          }
        }}
      />
    </section>
  );
}
