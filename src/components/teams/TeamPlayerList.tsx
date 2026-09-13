import type { Player } from "@/domain/players/types";
import { playerDisplayName } from "@/components/players/PlayerCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TeamPlayerList({
  players,
  onRemove,
}: {
  players: Player[];
  onRemove?: (playerId: number) => void;
}) {
  return (
    <div className="roster-height no-scrollbar max-h-36 overflow-y-auto">
      {players.length === 0 ? (
        <EmptyState
          title="No players selected"
          description="Choose available players to add them to this team."
        />
      ) : (
        <ul className="grid gap-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="player-row flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {playerDisplayName(player)}
                </p>
                <p className="text-xs text-muted-foreground">{player.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{player.position}</Badge>
                {onRemove ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(player.id)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
