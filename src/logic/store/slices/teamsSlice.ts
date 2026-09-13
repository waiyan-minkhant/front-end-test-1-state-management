import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MutationStatus } from "@/domain/common/types";
import type { Team } from "@/domain/teams/types";

export interface TeamsState {
  items: Team[];
  status: MutationStatus;
  error: string | null;
}

export const initialTeamsState: TeamsState = {
  items: [],
  status: "idle",
  error: null,
};

const teamsSlice = createSlice({
  name: "teams",
  initialState: initialTeamsState,
  reducers: {
    hydrateTeams(state, action: PayloadAction<Team[]>) {
      state.items = action.payload;
      state.status = "ready";
      state.error = null;
    },
    teamsMutationStarted(state) {
      state.status = "mutating";
      state.error = null;
    },
    teamsMutationFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    teamCreated(state, action: PayloadAction<Team>) {
      state.items.push(action.payload);
      state.status = "ready";
      state.error = null;
    },
    teamUpdated(state, action: PayloadAction<Team>) {
      state.items = state.items.map((team) =>
        team.id === action.payload.id ? action.payload : team,
      );
      state.status = "ready";
      state.error = null;
    },
    teamDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((team) => team.id !== action.payload);
      state.status = "ready";
      state.error = null;
    },
    clearTeamsError(state) {
      state.error = null;
      if (state.status === "failed") {
        state.status = "ready";
      }
    },
  },
});

export const {
  hydrateTeams,
  teamsMutationStarted,
  teamsMutationFailed,
  teamCreated,
  teamUpdated,
  teamDeleted,
  clearTeamsError,
} = teamsSlice.actions;

export const teamsReducer = teamsSlice.reducer;
