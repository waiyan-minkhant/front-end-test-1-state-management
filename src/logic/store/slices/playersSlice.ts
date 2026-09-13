import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PlayerFetchError, getErrorMessage } from "@/domain/common/errors";
import type { AsyncStatus } from "@/domain/common/types";
import type { Player } from "@/domain/players/types";
import { fetchAllPlayers, fetchPlayersPage } from "@/logic/services/playerService";
import { PLAYER_PAGE_SIZE } from "@/lib/constants";

interface PlayersThunkState {
  players: PlayersState;
}

export interface PlayersState {
  items: Player[];
  catalog: Player[];
  page: number;
  hasMore: boolean;
  status: AsyncStatus;
  catalogStatus: AsyncStatus;
  error: string | null;
  catalogError: string | null;
}

export const initialPlayersState: PlayersState = {
  items: [],
  catalog: [],
  page: 0,
  hasMore: true,
  status: "idle",
  catalogStatus: "idle",
  error: null,
  catalogError: null,
};

export const loadPlayersPage = createAsyncThunk<
  Awaited<ReturnType<typeof fetchPlayersPage>>,
  { page?: number } | undefined,
  { state: PlayersThunkState; rejectValue: string }
>(
  "players/loadPage",
  async (arg, { rejectWithValue }) => {
    try {
      return await fetchPlayersPage({
        page: arg?.page,
        limit: PLAYER_PAGE_SIZE,
      });
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, new PlayerFetchError().message),
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const { players } = getState();
      const requestedPage = arg?.page ?? players.page + 1;

      if (players.status === "loading" || players.status === "loadingMore") {
        return false;
      }

      if (requestedPage > 1 && !players.hasMore) {
        return false;
      }

      return true;
    },
  },
);

export const loadPlayerCatalog = createAsyncThunk<
  Player[],
  void,
  { state: PlayersThunkState; rejectValue: string }
>(
  "players/loadCatalog",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllPlayers();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, new PlayerFetchError().message),
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { players } = getState();
      return (
        players.catalogStatus === "idle" || players.catalogStatus === "failed"
      );
    },
  },
);

const playersSlice = createSlice({
  name: "players",
  initialState: initialPlayersState,
  reducers: {
    clearPlayersError(state) {
      state.error = null;
    },
    resetPlayers() {
      return initialPlayersState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPlayersPage.pending, (state, action) => {
        const requestedPage = action.meta.arg?.page ?? state.page + 1;
        state.status = requestedPage === 1 ? "loading" : "loadingMore";
        state.error = null;
      })
      .addCase(loadPlayersPage.fulfilled, (state, action) => {
        const incoming = action.payload.data;
        const existingIds = new Set(state.items.map((player) => player.id));
        const uniqueIncoming = incoming.filter(
          (player) => !existingIds.has(player.id),
        );

        state.items =
          action.payload.page === 1
            ? incoming
            : [...state.items, ...uniqueIncoming];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loadPlayersPage.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.status = "failed";
        state.error = action.payload ?? "Unable to load players.";
      })
      .addCase(loadPlayerCatalog.pending, (state) => {
        state.catalogStatus = "loading";
        state.catalogError = null;
      })
      .addCase(loadPlayerCatalog.fulfilled, (state, action) => {
        state.catalog = action.payload;
        state.catalogStatus = "succeeded";
        state.catalogError = null;
      })
      .addCase(loadPlayerCatalog.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.catalogStatus = "failed";
        state.catalogError = action.payload ?? "Unable to load players.";
      });
  },
});

export const { clearPlayersError, resetPlayers } = playersSlice.actions;

export const playersReducer = playersSlice.reducer;
