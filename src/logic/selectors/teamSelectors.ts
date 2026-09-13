import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/logic/store";
import { getAssignedPlayerIds } from "@/logic/services/teamService";

export function selectAllTeams(state: RootState) {
  return state.teams.items;
}

export function selectTeamsStatus(state: RootState) {
  return state.teams.status;
}

export function selectTeamsError(state: RootState) {
  return state.teams.error;
}

export const selectTeamById = createSelector(
  [selectAllTeams, (_state: RootState, teamId: string | undefined) => teamId],
  (teams, teamId) => teams.find((team) => team.id === teamId),
);

export const selectAssignedPlayerIds = createSelector(
  [selectAllTeams],
  (teams) => [...getAssignedPlayerIds(teams)],
);

export const selectAssignedPlayerIdSet = createSelector(
  [selectAllTeams],
  (teams) => getAssignedPlayerIds(teams),
);

export const selectPlayerCountForTeam = createSelector(
  [selectAllTeams, (_state: RootState, teamId: string) => teamId],
  (teams, teamId) =>
    teams.find((team) => team.id === teamId)?.playerIds.length ?? 0,
);

export const selectIsPlayerAssigned = createSelector(
  [selectAssignedPlayerIdSet, (_state: RootState, playerId: number) => playerId],
  (assigned, playerId) => assigned.has(playerId),
);

export const selectUnavailablePlayerOwners = createSelector(
  [selectAllTeams, (_state: RootState, excludeTeamId?: string) => excludeTeamId],
  (teams, excludeTeamId) => {
    const owners = new Map<number, string>();

    for (const team of teams) {
      if (excludeTeamId && team.id === excludeTeamId) {
        continue;
      }

      for (const playerId of team.playerIds) {
        owners.set(playerId, team.name);
      }
    }

    return owners;
  },
);
