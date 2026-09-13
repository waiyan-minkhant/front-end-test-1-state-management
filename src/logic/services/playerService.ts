import { playerRepository } from "@/data/players/createPlayerRepository";
import type { PlayerRepository } from "@/data/players/playerRepository";
import { PlayerFetchError, getErrorMessage } from "@/domain/common/errors";
import type { PaginatedPlayers, Player, PlayerListQuery } from "@/domain/players/types";
import { PLAYER_PAGE_SIZE } from "@/lib/constants";

export async function fetchPlayersPage(
  params: Partial<PlayerListQuery> = {},
  repository: PlayerRepository = playerRepository,
): Promise<PaginatedPlayers> {
  const query: PlayerListQuery = {
    page: params.page ?? 1,
    limit: params.limit ?? PLAYER_PAGE_SIZE,
  };

  try {
    return await repository.getPlayers(query);
  } catch (error) {
    if (error instanceof PlayerFetchError) {
      throw error;
    }

    throw new PlayerFetchError(
      getErrorMessage(error, "Unable to load players."),
    );
  }
}

export async function fetchAllPlayers(
  repository: PlayerRepository = playerRepository,
): Promise<Player[]> {
  try {
    return await repository.getAllPlayers();
  } catch (error) {
    if (error instanceof PlayerFetchError) {
      throw error;
    }

    throw new PlayerFetchError(
      getErrorMessage(error, "Unable to load players."),
    );
  }
}
