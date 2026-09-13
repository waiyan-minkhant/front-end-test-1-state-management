"use client";

import { useMemo, useState } from "react";
import type { Player } from "@/domain/players/types";
import { matchesPlayerSearch } from "@/logic/selectors/playerSelectors";
import { playerDisplayName } from "@/components/players/PlayerCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeamPlayerList } from "@/components/teams/TeamPlayerList";

interface TeamPlayerSelectorProps {
  players: Player[];
  selectedIds: number[];
  unavailableByPlayerId: Map<number, string>;
  onChange: (playerIds: number[]) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TeamPlayerSelector({
  players,
  selectedIds,
  unavailableByPlayerId,
  onChange,
  isLoading = false,
  error,
}: TeamPlayerSelectorProps) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedPlayers = useMemo(
    () => players.filter((player) => selectedSet.has(player.id)),
    [players, selectedSet],
  );

  const visiblePlayers = useMemo(
    () => players.filter((player) => matchesPlayerSearch(player, query)),
    [players, query],
  );

  function togglePlayer(player: Player, checked: boolean) {
    if (unavailableByPlayerId.has(player.id)) {
      return;
    }

    if (checked) {
      onChange([...selectedIds, player.id]);
      return;
    }

    onChange(selectedIds.filter((id) => id !== player.id));
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Players: {selectedIds.length}</p>
        <p className="text-sm text-muted-foreground">
          A player can belong to only one team.
        </p>
      </div>

      <TeamPlayerList
        players={selectedPlayers}
        onRemove={(playerId) =>
          onChange(selectedIds.filter((id) => id !== playerId))
        }
      />

      <div className="grid gap-2">
        <Label htmlFor="team-player-search">Search available players</Label>
        <Input
          id="team-player-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="First or last name"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading players...</p>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      {!isLoading && players.length === 0 ? (
        <EmptyState
          title="No players available"
          description="The player catalog is empty, so a team cannot be assigned players yet."
        />
      ) : null}

      {!isLoading && players.length > 0 && visiblePlayers.length === 0 ? (
        <EmptyState
          title="No matching players"
          description="No catalog players match that name."
        />
      ) : null}

      {visiblePlayers.length > 0 ? (
        <ScrollArea className="no-scrollbar h-56 rounded-md border [&_[data-slot=scroll-area-scrollbar]]:hidden [&_[data-slot=scroll-area-viewport]]:no-scrollbar">
          <ul className="grid gap-1 p-2">
            {visiblePlayers.map((player) => {
              const owner = unavailableByPlayerId.get(player.id);
              const unavailable = Boolean(owner);
              const checked = selectedSet.has(player.id);
              const inputId = `player-${player.id}`;

              return (
                <li key={player.id}>
                  <label
                    htmlFor={inputId}
                    className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/60 has-disabled:cursor-not-allowed has-disabled:opacity-70"
                  >
                    <Checkbox
                      id={inputId}
                      checked={checked}
                      disabled={unavailable}
                      onCheckedChange={(value) =>
                        togglePlayer(player, value === true)
                      }
                    />
                    <span className="grid min-w-0 gap-1">
                      <span className="text-sm font-medium">
                        {playerDisplayName(player)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {player.position}
                        {player.affiliation
                          ? ` · ${player.affiliation.city} ${player.affiliation.name}`
                          : ""}
                      </span>
                      {unavailable ? (
                        <span className="text-xs">
                          Unavailable because this player already belongs to{" "}
                          {owner}.
                        </span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      ) : null}
    </div>
  );
}
