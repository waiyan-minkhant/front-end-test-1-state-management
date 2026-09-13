import {
  PlayerAlreadyAssignedError,
  TeamNotFoundError,
} from "@/domain/common/errors";
import type { Team, TeamFormData } from "@/domain/teams/types";
import {
  assertTeamNameAvailable,
  parseTeamFormData,
} from "@/domain/teams/validators";

export interface TeamServiceOptions {
  createId?: () => string;
  now?: () => string;
}

function uniquePlayerIds(playerIds: number[]): number[] {
  return [...new Set(playerIds)];
}

export function findTeamById(teams: Team[], teamId: string): Team {
  const team = teams.find((item) => item.id === teamId);

  if (!team) {
    throw new TeamNotFoundError(teamId);
  }

  return team;
}

export function getAssignedPlayerIds(
  teams: Team[],
  excludeTeamId?: string,
): Set<number> {
  const assigned = new Set<number>();

  for (const team of teams) {
    if (excludeTeamId && team.id === excludeTeamId) {
      continue;
    }

    for (const playerId of team.playerIds) {
      assigned.add(playerId);
    }
  }

  return assigned;
}

export function findTeamForPlayer(
  teams: Team[],
  playerId: number,
): Team | undefined {
  return teams.find((team) => team.playerIds.includes(playerId));
}

function assertPlayersAreAvailable(
  playerIds: number[],
  teams: Team[],
  excludeTeamId?: string,
): void {
  const assigned = getAssignedPlayerIds(teams, excludeTeamId);

  for (const playerId of playerIds) {
    if (assigned.has(playerId)) {
      const owner = findTeamForPlayer(teams, playerId);
      throw new PlayerAlreadyAssignedError(playerId, owner?.name);
    }
  }
}

export function createTeam(
  input: TeamFormData,
  teams: Team[],
  options: TeamServiceOptions = {},
): Team {
  const data = parseTeamFormData(input);
  const playerIds = uniquePlayerIds(data.playerIds);

  assertTeamNameAvailable(data.name, teams);
  assertPlayersAreAvailable(playerIds, teams);

  const timestamp = options.now?.() ?? new Date().toISOString();
  const createId = options.createId ?? (() => crypto.randomUUID());

  return {
    id: createId(),
    name: data.name,
    region: data.region,
    country: data.country,
    playerIds,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateTeam(
  teamId: string,
  input: TeamFormData,
  teams: Team[],
  options: TeamServiceOptions = {},
): Team {
  const current = findTeamById(teams, teamId);
  const data = parseTeamFormData(input);
  const playerIds = uniquePlayerIds(data.playerIds);

  assertTeamNameAvailable(data.name, teams, teamId);
  assertPlayersAreAvailable(playerIds, teams, teamId);

  return {
    ...current,
    name: data.name,
    region: data.region,
    country: data.country,
    playerIds,
    updatedAt: options.now?.() ?? new Date().toISOString(),
  };
}

export function deleteTeam(teamId: string, teams: Team[]): Team[] {
  findTeamById(teams, teamId);
  return teams.filter((team) => team.id !== teamId);
}

export function addPlayerToTeam(
  teamId: string,
  playerId: number,
  teams: Team[],
  options: TeamServiceOptions = {},
): Team {
  const current = findTeamById(teams, teamId);

  if (current.playerIds.includes(playerId)) {
    return current;
  }

  assertPlayersAreAvailable([playerId], teams, teamId);

  return {
    ...current,
    playerIds: [...current.playerIds, playerId],
    updatedAt: options.now?.() ?? new Date().toISOString(),
  };
}

export function removePlayerFromTeam(
  teamId: string,
  playerId: number,
  teams: Team[],
  options: TeamServiceOptions = {},
): Team {
  const current = findTeamById(teams, teamId);

  if (!current.playerIds.includes(playerId)) {
    return current;
  }

  return {
    ...current,
    playerIds: current.playerIds.filter((id) => id !== playerId),
    updatedAt: options.now?.() ?? new Date().toISOString(),
  };
}

export function replaceTeam(teams: Team[], nextTeam: Team): Team[] {
  return teams.map((team) => (team.id === nextTeam.id ? nextTeam : team));
}
