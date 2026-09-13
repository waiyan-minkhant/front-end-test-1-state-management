import { describe, expect, it } from "vitest";
import { PLAYER_FIXTURES } from "@/data/fixtures/players";
import { MockPlayerRepository } from "@/data/players/mockPlayerRepository";
import { PLAYER_PAGE_SIZE } from "@/lib/constants";
import { fetchPlayersPage } from "@/logic/services/playerService";

describe("player pagination", () => {
  const repository = new MockPlayerRepository({ delayMs: 0 });

  it("returns exactly 10 players per request", async () => {
    const page = await fetchPlayersPage(
      { page: 1, limit: PLAYER_PAGE_SIZE },
      repository,
    );

    expect(page.data).toHaveLength(10);
    expect(page.limit).toBe(10);
    expect(page.data.map((player) => player.id)).toEqual(
      PLAYER_FIXTURES.slice(0, 10).map((player) => player.id),
    );
  });

  it("exposes hasMore until the final page", async () => {
    const first = await repository.getPlayers({ page: 1, limit: 10 });
    const lastPage = Math.ceil(PLAYER_FIXTURES.length / 10);
    const last = await repository.getPlayers({ page: lastPage, limit: 10 });
    const afterLast = await repository.getPlayers({
      page: lastPage + 1,
      limit: 10,
    });

    expect(first.hasMore).toBe(true);
    expect(last.data.length).toBeGreaterThan(0);
    expect(last.hasMore).toBe(false);
    expect(afterLast.data).toHaveLength(0);
    expect(afterLast.hasMore).toBe(false);
  });

  it("keeps player identities stable across requests", async () => {
    const again = await repository.getPlayers({ page: 2, limit: 10 });
    expect(again.data[0]?.id).toBe(PLAYER_FIXTURES[10]?.id);
    expect(again.data[0]?.firstName).toBe(PLAYER_FIXTURES[10]?.firstName);
  });
});
