import { PLAYER_FIXTURES } from "@/data/fixtures/players";
import type { PlayerRepository } from "@/data/players/playerRepository";
import type { PaginatedPlayers, Player, PlayerListQuery } from "@/domain/players/types";
import { MOCK_PLAYER_REQUEST_DELAY_MS, PLAYER_PAGE_SIZE } from "@/lib/constants";

export interface MockPlayerRepositoryOptions {
  players?: Player[];
  delayMs?: number;
}

function wait(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * In-memory player source used for this assessment.
 * Data is synthetic and deterministic — it is not from an external API.
 */
export class MockPlayerRepository implements PlayerRepository {
  private readonly players: Player[];
  private readonly delayMs: number;

  constructor(options: MockPlayerRepositoryOptions = {}) {
    this.players = options.players ?? PLAYER_FIXTURES;
    this.delayMs = options.delayMs ?? MOCK_PLAYER_REQUEST_DELAY_MS;
  }

  async getPlayers(params: PlayerListQuery): Promise<PaginatedPlayers> {
    const page = Math.max(1, params.page);
    const limit = params.limit > 0 ? params.limit : PLAYER_PAGE_SIZE;
    const start = (page - 1) * limit;

    await wait(this.delayMs);

    const data = this.players.slice(start, start + limit);

    return {
      data,
      page,
      limit,
      hasMore: start + data.length < this.players.length,
      total: this.players.length,
    };
  }

  async getAllPlayers(): Promise<Player[]> {
    await wait(Math.min(this.delayMs, 80));
    return [...this.players];
  }
}
