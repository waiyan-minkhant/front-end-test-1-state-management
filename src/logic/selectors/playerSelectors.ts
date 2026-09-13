import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/logic/store";
import { selectUnavailablePlayerOwners } from "@/logic/selectors/teamSelectors";

export function selectLoadedPlayers(state: RootState) {
  return state.players.items;
}

export function selectPlayerCatalog(state: RootState) {
  return state.players.catalog;
}

export function selectPlayersStatus(state: RootState) {
  return state.players.status;
}

export function selectPlayersError(state: RootState) {
  return state.players.error;
}

export function selectPlayersHasMore(state: RootState) {
  return state.players.hasMore;
}

export function selectPlayersPage(state: RootState) {
  return state.players.page;
}

export function selectCatalogStatus(state: RootState) {
  return state.players.catalogStatus;
}

export function selectCatalogError(state: RootState) {
  return state.players.catalogError;
}

export const selectAvailablePlayers = createSelector(
  [
    selectPlayerCatalog,
    (state: RootState, excludeTeamId?: string) =>
      selectUnavailablePlayerOwners(state, excludeTeamId),
  ],
  (catalog, unavailable) =>
    catalog.filter((player) => !unavailable.has(player.id)),
);

export function matchesPlayerSearch(player: {
  firstName: string;
  lastName: string;
}, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
  return (
    player.firstName.toLowerCase().includes(normalized) ||
    player.lastName.toLowerCase().includes(normalized) ||
    fullName.includes(normalized)
  );
}

export const selectFilteredLoadedPlayers = createSelector(
  [selectLoadedPlayers, (_state: RootState, query: string) => query],
  (players, query) => players.filter((player) => matchesPlayerSearch(player, query)),
);
