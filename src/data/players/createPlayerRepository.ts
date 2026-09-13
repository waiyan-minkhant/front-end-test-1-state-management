import { MockPlayerRepository } from "@/data/players/mockPlayerRepository";
import type { PlayerRepository } from "@/data/players/playerRepository";

/**
 * Composition root for player data.
 * Swap MockPlayerRepository for ApiPlayerRepository here when a live API is ready.
 * Domain rules, Redux shape, and UI components stay unchanged.
 */
export function createPlayerRepository(): PlayerRepository {
  return new MockPlayerRepository();
}

export const playerRepository = createPlayerRepository();
