import type { StorageService } from "@/data/storage/storageService";
import { localStorageService } from "@/data/storage/localStorageService";
import type { User } from "@/domain/auth/types";
import type { Team } from "@/domain/teams/types";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AuthState } from "@/logic/store/slices/authSlice";
import { initialAuthState } from "@/logic/store/slices/authSlice";

interface PersistedAuth {
  user: User | null;
  isAuthenticated: boolean;
}

interface PersistedTeams {
  items: Team[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.username === "string"
  );
}

function isTeam(value: unknown): value is Team {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.region === "string" &&
    typeof value.country === "string" &&
    Array.isArray(value.playerIds) &&
    value.playerIds.every((id) => typeof id === "number") &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function parsePersistedAuth(value: unknown): AuthState {
  if (!isObject(value)) {
    return initialAuthState;
  }

  const user = value.user == null ? null : isUser(value.user) ? value.user : null;
  const isAuthenticated = value.isAuthenticated === true && user != null;

  if (value.isAuthenticated === true && user == null) {
    return initialAuthState;
  }

  return { user, isAuthenticated };
}

export function parsePersistedTeams(value: unknown): Team[] {
  if (!isObject(value) || !Array.isArray(value.items)) {
    if (Array.isArray(value)) {
      return value.filter(isTeam);
    }
    return [];
  }

  return value.items.filter(isTeam);
}

export function readPersistedAuth(
  storage: StorageService = localStorageService,
): AuthState {
  return parsePersistedAuth(storage.get<PersistedAuth>(STORAGE_KEYS.auth));
}

export function readPersistedTeams(
  storage: StorageService = localStorageService,
): Team[] {
  return parsePersistedTeams(storage.get<PersistedTeams>(STORAGE_KEYS.teams));
}

function hasSameJson(current: unknown, next: unknown): boolean {
  try {
    return JSON.stringify(current) === JSON.stringify(next);
  } catch {
    return false;
  }
}

export function persistAuth(
  auth: AuthState,
  storage: StorageService = localStorageService,
): void {
  const payload: PersistedAuth = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  };

  if (hasSameJson(storage.get<PersistedAuth>(STORAGE_KEYS.auth), payload)) {
    return;
  }

  storage.set(STORAGE_KEYS.auth, payload);
}

export function persistTeams(
  teams: Team[],
  storage: StorageService = localStorageService,
): void {
  const payload: PersistedTeams = { items: teams };

  if (hasSameJson(storage.get<PersistedTeams>(STORAGE_KEYS.teams), payload)) {
    return;
  }

  storage.set(STORAGE_KEYS.teams, payload);
}

export function clearPersistedAuth(
  storage: StorageService = localStorageService,
): void {
  storage.remove(STORAGE_KEYS.auth);
}
