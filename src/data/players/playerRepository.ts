import type { PaginatedPlayers, Player, PlayerListQuery } from "@/domain/players/types";

export interface PlayerRepository {
  getPlayers(params: PlayerListQuery): Promise<PaginatedPlayers>;
  getAllPlayers(): Promise<Player[]>;
}
