import { z } from "zod";
import {
  TEAM_NAME_MAX_LENGTH,
  TEAM_NAME_MIN_LENGTH,
} from "@/lib/constants";
import { InvalidTeamDataError, TeamNameAlreadyExistsError } from "@/domain/common/errors";
import type { Team, TeamFormData } from "@/domain/teams/types";

export function normalizeTeamName(name: string): string {
  return name.trim().toLowerCase();
}

export function isSameTeamName(left: string, right: string): boolean {
  return normalizeTeamName(left) === normalizeTeamName(right);
}

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, "Team name is required.")
  .min(
    TEAM_NAME_MIN_LENGTH,
    `Team name must be between ${TEAM_NAME_MIN_LENGTH} and ${TEAM_NAME_MAX_LENGTH} characters.`,
  )
  .max(
    TEAM_NAME_MAX_LENGTH,
    `Team name must be between ${TEAM_NAME_MIN_LENGTH} and ${TEAM_NAME_MAX_LENGTH} characters.`,
  );

export const regionSchema = z.string().trim().min(1, "Region is required.");

export const countrySchema = z.string().trim().min(1, "Country is required.");

export const teamPlayerIdsSchema = z.array(z.number().int().positive());

export interface TeamFormSchemaOptions {
  existingNames?: string[];
  currentName?: string;
}

export function createTeamFormSchema(options: TeamFormSchemaOptions = {}) {
  const existingNames = options.existingNames ?? [];
  const currentName = options.currentName;

  return z.object({
    name: teamNameSchema.refine(
      (name) => {
        return !existingNames.some((existing) => {
          if (currentName && isSameTeamName(existing, currentName)) {
            return false;
          }
          return isSameTeamName(existing, name);
        });
      },
      { message: "A team with this name already exists." },
    ),
    region: regionSchema,
    country: countrySchema,
    playerIds: teamPlayerIdsSchema,
  });
}

export const teamFormSchema = createTeamFormSchema();

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export function assertTeamNameAvailable(
  name: string,
  teams: Team[],
  excludeTeamId?: string,
): void {
  const taken = teams.some((team) => {
    if (excludeTeamId && team.id === excludeTeamId) {
      return false;
    }
    return isSameTeamName(team.name, name);
  });

  if (taken) {
    throw new TeamNameAlreadyExistsError(name.trim());
  }
}

export function parseTeamFormData(input: TeamFormData): TeamFormData {
  const result = teamFormSchema.safeParse(input);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw new InvalidTeamDataError(
      firstIssue?.message ?? "The team form contains invalid data.",
    );
  }

  return {
    ...result.data,
    playerIds: [...new Set(result.data.playerIds)],
  };
}
