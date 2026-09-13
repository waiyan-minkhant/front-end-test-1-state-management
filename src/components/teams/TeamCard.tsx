"use client";

import type { Player } from "@/domain/players/types";
import type { Team } from "@/domain/teams/types";
import { playerDisplayName } from "@/components/players/PlayerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TeamCard({
  team,
  players,
  onEdit,
  onDelete,
}: {
  team: Team;
  players: Player[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle as="h3">{team.name}</CardTitle>
            <CardDescription>
              {team.region}, {team.country}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {team.playerIds.length}{" "}
            {team.playerIds.length === 1 ? "player" : "players"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid flex-1 gap-2">
        {players.length === 0 ? (
          <p className="text-sm text-muted-foreground">No players assigned.</p>
        ) : (
          <ul className="grid gap-1 text-sm">
            {players.map((player) => (
              <li key={player.id}>
                {playerDisplayName(player)} · {player.position}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="mt-auto justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          aria-label={`Edit ${team.name}`}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          aria-label={`Delete ${team.name}`}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
