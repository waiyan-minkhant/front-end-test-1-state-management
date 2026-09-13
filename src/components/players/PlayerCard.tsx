import type { Player } from "@/domain/players/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function playerDisplayName(player: Player) {
  return `${player.firstName} ${player.lastName}`;
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{playerDisplayName(player)}</p>
            {player.affiliation ? (
              <p className="text-sm text-muted-foreground">
                {player.affiliation.city} {player.affiliation.name}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary">{player.position}</Badge>
        </div>
        {player.height ? (
          <p className="text-sm text-muted-foreground">Height {player.height}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
