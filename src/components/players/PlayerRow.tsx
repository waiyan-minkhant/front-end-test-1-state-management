import type { Player } from "@/domain/players/types";
import { Badge } from "@/components/ui/badge";
import { playerDisplayName } from "@/components/players/PlayerCard";

export function PlayerRow({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
      <div className="min-w-0">
        <p className="truncate font-medium">{playerDisplayName(player)}</p>
        <p className="truncate text-sm text-muted-foreground">
          {player.affiliation
            ? `${player.affiliation.city} ${player.affiliation.name}`
            : "Independent"}
          {player.height ? ` · ${player.height}` : ""}
        </p>
      </div>
      <Badge variant="outline">{player.position}</Badge>
    </div>
  );
}
