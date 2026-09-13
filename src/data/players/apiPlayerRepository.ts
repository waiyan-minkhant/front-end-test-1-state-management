import { PlayerFetchError } from "@/domain/common/errors";
import type { PaginatedPlayers, Player, PlayerListQuery } from "@/domain/players/types";
import type { PlayerRepository } from "@/data/players/playerRepository";
import { PLAYER_PAGE_SIZE } from "@/lib/constants";

interface BallDontLiePlayer {
  id: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  height_feet?: number | null;
  height_inches?: number | null;
  team?: {
    city?: string;
    full_name?: string;
    name?: string;
  } | null;
}

interface BallDontLieMeta {
  next_page?: number | null;
  total_count?: number;
}

interface BallDontLiePlayersResponse {
  data?: BallDontLiePlayer[];
  meta?: BallDontLieMeta;
}

const BALLDONTLIE_PLAYERS_URL = "https://www.balldontlie.io/api/v1/players";

function formatHeight(
  feet: number | null | undefined,
  inches: number | null | undefined,
): string | undefined {
  if (feet == null) {
    return undefined;
  }

  return inches == null ? `${feet}-0` : `${feet}-${inches}`;
}

function mapPlayer(record: BallDontLiePlayer): Player {
  return {
    id: record.id,
    firstName: record.first_name ?? "Unknown",
    lastName: record.last_name ?? "Player",
    position: record.position || "G",
    height: formatHeight(record.height_feet, record.height_inches),
    affiliation: record.team
      ? {
          city: record.team.city ?? "",
          name: record.team.name ?? record.team.full_name ?? "",
        }
      : undefined,
  };
}

/**
 * Isolated adapter for a future live API swap.
 * This class is not wired as the active repository.
 */
export class ApiPlayerRepository implements PlayerRepository {
  constructor(private readonly baseUrl = BALLDONTLIE_PLAYERS_URL) {}

  async getPlayers(params: PlayerListQuery): Promise<PaginatedPlayers> {
    const page = Math.max(1, params.page);
    const limit = params.limit > 0 ? params.limit : PLAYER_PAGE_SIZE;
    const url = new URL(this.baseUrl);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(limit));

    let response: Response;

    try {
      response = await fetch(url);
    } catch {
      throw new PlayerFetchError("Unable to reach the players API.");
    }

    if (!response.ok) {
      throw new PlayerFetchError("The players API returned an error.");
    }

    const payload = (await response.json()) as BallDontLiePlayersResponse;
    const data = (payload.data ?? []).map(mapPlayer);
    const total = payload.meta?.total_count ?? page * limit;
    const hasMore =
      payload.meta?.next_page != null || page * limit < total;

    return {
      data,
      page,
      limit,
      hasMore,
      total,
    };
  }

  async getAllPlayers(): Promise<Player[]> {
    const collected: Player[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await this.getPlayers({ page, limit: PLAYER_PAGE_SIZE });
      collected.push(...result.data);
      hasMore = result.hasMore;
      page += 1;
    }

    return collected;
  }
}
