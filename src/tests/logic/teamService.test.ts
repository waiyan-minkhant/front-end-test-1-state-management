import { describe, expect, it } from "vitest";
import { PlayerAlreadyAssignedError } from "@/domain/common/errors";
import type { Team, TeamFormData } from "@/domain/teams/types";
import {
  addPlayerToTeam,
  createTeam,
  deleteTeam,
  getAssignedPlayerIds,
  removePlayerFromTeam,
  updateTeam,
} from "@/logic/services/teamService";

const stamp = "2026-01-01T00:00:00.000Z";

function form(overrides: Partial<TeamFormData> = {}): TeamFormData {
  return {
    name: "Chicago Bulls",
    region: "Midwest",
    country: "United States",
    playerIds: [1, 2],
    ...overrides,
  };
}

function team(overrides: Partial<Team> = {}): Team {
  return {
    id: "team-a",
    name: "Chicago Bulls",
    region: "Midwest",
    country: "United States",
    playerIds: [1, 2],
    createdAt: stamp,
    updatedAt: stamp,
    ...overrides,
  };
}

describe("teamService ownership and uniqueness", () => {
  it("creates a team and rejects a case-insensitive duplicate name", () => {
    const created = createTeam(form(), [], {
      createId: () => "team-a",
      now: () => stamp,
    });

    expect(created.playerIds).toEqual([1, 2]);

    expect(() =>
      createTeam(form({ name: " chicago bulls " }), [created], {
        createId: () => "team-b",
      }),
    ).toThrow(/already exists/i);
  });

  it("rejects assigning a player who already belongs to another team", () => {
    const teamA = team();

    expect(() =>
      createTeam(form({ name: "Boston Harbor", playerIds: [2, 3] }), [teamA], {
        createId: () => "team-b",
      }),
    ).toThrow(PlayerAlreadyAssignedError);

    expect(() => addPlayerToTeam("missing", 3, [teamA])).toThrow(/not be found/i);

    expect(() => addPlayerToTeam("team-a", 2, [teamA])).not.toThrow();
    expect(() => addPlayerToTeam("team-b", 2, [teamA, team({ id: "team-b", name: "B", playerIds: [] })])).toThrow(
      PlayerAlreadyAssignedError,
    );
  });

  it("makes a player available after removal", () => {
    const teamA = team({ playerIds: [10] });
    const next = removePlayerFromTeam("team-a", 10, [teamA], { now: () => stamp });

    expect(next.playerIds).toEqual([]);
    expect(getAssignedPlayerIds([next]).has(10)).toBe(false);
  });

  it("releases players when a team is deleted", () => {
    const teamA = team({ playerIds: [10, 11] });
    const remaining = deleteTeam("team-a", [teamA]);

    expect(remaining).toEqual([]);
    expect(getAssignedPlayerIds(remaining).has(10)).toBe(false);
    expect(getAssignedPlayerIds(remaining).has(11)).toBe(false);
  });

  it("keeps a team's own players selectable while blocking other teams", () => {
    const teamA = team({ playerIds: [10, 11] });
    const teamB = team({
      id: "team-b",
      name: "Boston Harbor",
      playerIds: [12],
    });

    const updated = updateTeam(
      "team-a",
      form({
        name: "Chicago Bulls",
        playerIds: [10, 13],
      }),
      [teamA, teamB],
      { now: () => stamp },
    );

    expect(updated.playerIds).toEqual([10, 13]);

    expect(() =>
      updateTeam(
        "team-a",
        form({ name: "Chicago Bulls", playerIds: [10, 12] }),
        [teamA, teamB],
      ),
    ).toThrow(PlayerAlreadyAssignedError);
  });
});
