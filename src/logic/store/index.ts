import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { StorageService } from "@/data/storage/storageService";
import { localStorageService } from "@/data/storage/localStorageService";
import {
  persistAuth,
  persistTeams,
  readPersistedAuth,
  readPersistedTeams,
} from "@/logic/store/persistence";
import {
  authReducer,
  hydrateAuth,
  loginSucceeded,
  logoutSucceeded,
} from "@/logic/store/slices/authSlice";
import { playersReducer } from "@/logic/store/slices/playersSlice";
import {
  hydrateTeams,
  teamCreated,
  teamDeleted,
  teamUpdated,
  teamsReducer,
} from "@/logic/store/slices/teamsSlice";

export interface CreateAppStoreOptions {
  storage?: StorageService;
}

const persistableAuthActions = isAnyOf(loginSucceeded, logoutSucceeded);
const persistableTeamActions = isAnyOf(teamCreated, teamUpdated, teamDeleted);

function createPersistMiddleware(storage: StorageService) {
  const listener = createListenerMiddleware();

  listener.startListening({
    matcher: persistableAuthActions,
    effect: (_action, api) => {
      persistAuth((api.getState() as RootState).auth, storage);
    },
  });

  listener.startListening({
    matcher: persistableTeamActions,
    effect: (_action, api) => {
      persistTeams((api.getState() as RootState).teams.items, storage);
    },
  });

  return listener.middleware;
}

export function createAppStore(options: CreateAppStoreOptions = {}) {
  const storage = options.storage ?? localStorageService;

  return configureStore({
    reducer: {
      auth: authReducer,
      players: playersReducer,
      teams: teamsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(createPersistMiddleware(storage)),
  });
}

export function hydrateStore(
  store: AppStore,
  storage: StorageService = localStorageService,
): void {
  store.dispatch(hydrateAuth(readPersistedAuth(storage)));
  store.dispatch(hydrateTeams(readPersistedTeams(storage)));
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
