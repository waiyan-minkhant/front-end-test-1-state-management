import { describe, expect, it } from "vitest";
import { TeamNameAlreadyExistsError } from "@/domain/common/errors";
import {
  assertTeamNameAvailable,
  createTeamFormSchema,
  isSameTeamName,
  normalizeTeamName,
} from "@/domain/teams/validators";
import type { Team } from "@/domain/teams/types";

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    id: "team-1",
    name: "Chicago Bulls",
    region: "Midwest",
    country: "United States",
    playerIds: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("team name uniqueness", () => {
  it("treats trimmed and case-changed names as the same", () => {
    expect(normalizeTeamName(" Chicago Bulls ")).toBe("chicago bulls");
    expect(isSameTeamName("Chicago Bulls", " chicago bulls ")).toBe(true);
    expect(isSameTeamName("Chicago Bulls", "CHICAGO BULLS")).toBe(true);
  });

  it("rejects a duplicate name against existing teams", () => {
    expect(() =>
      assertTeamNameAvailable(" chicago bulls ", [makeTeam()]),
    ).toThrow(TeamNameAlreadyExistsError);
  });

  it("allows the same name when updating the same team", () => {
    expect(() =>
      assertTeamNameAvailable("Chicago Bulls", [makeTeam()], "team-1"),
    ).not.toThrow();
  });

  it("surfaces a field error from the form schema", () => {
    const schema = createTeamFormSchema({
      existingNames: ["Chicago Bulls"],
    });

    const result = schema.safeParse({
      name: "CHICAGO BULLS",
      region: "Midwest",
      country: "United States",
      playerIds: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "A team with this name already exists.",
      );
    }
  });
});
