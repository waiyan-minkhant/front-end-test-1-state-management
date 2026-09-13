"use client";

import { getErrorMessage } from "@/domain/common/errors";
import type { TeamFormData } from "@/domain/teams/types";
import {
  selectAllTeams,
  selectTeamsError,
  selectTeamsStatus,
} from "@/logic/selectors/teamSelectors";
import {
  addPlayerToTeam,
  createTeam,
  deleteTeam,
  removePlayerFromTeam,
  updateTeam,
} from "@/logic/services/teamService";
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks";
import {
  clearTeamsError,
  teamCreated,
  teamDeleted,
  teamUpdated,
  teamsMutationFailed,
  teamsMutationStarted,
} from "@/logic/store/slices/teamsSlice";

export function useTeams() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectAllTeams);
  const status = useAppSelector(selectTeamsStatus);
  const error = useAppSelector(selectTeamsError);

  function create(input: TeamFormData) {
    dispatch(teamsMutationStarted());

    try {
      const team = createTeam(input, teams);
      dispatch(teamCreated(team));
      return { ok: true as const, team };
    } catch (caught) {
      const message = getErrorMessage(caught, "Unable to create the team.");
      dispatch(teamsMutationFailed(message));
      return { ok: false as const, message };
    }
  }

  function update(teamId: string, input: TeamFormData) {
    dispatch(teamsMutationStarted());

    try {
      const team = updateTeam(teamId, input, teams);
      dispatch(teamUpdated(team));
      return { ok: true as const, team };
    } catch (caught) {
      const message = getErrorMessage(caught, "Unable to update the team.");
      dispatch(teamsMutationFailed(message));
      return { ok: false as const, message };
    }
  }

  function remove(teamId: string) {
    dispatch(teamsMutationStarted());

    try {
      deleteTeam(teamId, teams);
      dispatch(teamDeleted(teamId));
      return { ok: true as const };
    } catch (caught) {
      const message = getErrorMessage(caught, "Unable to delete the team.");
      dispatch(teamsMutationFailed(message));
      return { ok: false as const, message };
    }
  }

  function addPlayer(teamId: string, playerId: number) {
    try {
      const team = addPlayerToTeam(teamId, playerId, teams);
      dispatch(teamUpdated(team));
      return { ok: true as const, team };
    } catch (caught) {
      const message = getErrorMessage(caught, "Unable to add that player.");
      return { ok: false as const, message };
    }
  }

  function removePlayer(teamId: string, playerId: number) {
    try {
      const team = removePlayerFromTeam(teamId, playerId, teams);
      dispatch(teamUpdated(team));
      return { ok: true as const, team };
    } catch (caught) {
      const message = getErrorMessage(caught, "Unable to remove that player.");
      return { ok: false as const, message };
    }
  }

  return {
    teams,
    status,
    error,
    create,
    update,
    remove,
    addPlayer,
    removePlayer,
    clearError: () => dispatch(clearTeamsError()),
  };
}
