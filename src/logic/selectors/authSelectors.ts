import type { RootState } from "@/logic/store";

export function selectCurrentUser(state: RootState) {
  return state.auth.user;
}

export function selectIsAuthenticated(state: RootState) {
  return state.auth.isAuthenticated && state.auth.user != null;
}
