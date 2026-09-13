import { describe, expect, it } from "vitest";
import type { StorageService } from "@/data/storage/storageService";
import { STORAGE_KEYS } from "@/lib/constants";
import { loginUser } from "@/logic/services/authService";
import {
  createAppStore,
  hydrateStore,
} from "@/logic/store";
import { loginSucceeded, logoutSucceeded } from "@/logic/store/slices/authSlice";
import { parsePersistedAuth } from "@/logic/store/persistence";

class MemoryStorage implements StorageService {
  private readonly values = new Map<string, string>();

  get<T>(key: string): T | null {
    const raw = this.values.get(key);
    if (raw == null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.values.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.values.delete(key);
  }
}

describe("authentication persistence", () => {
  it("persists login and restores it on a new store", () => {
    const storage = new MemoryStorage();
    const store = createAppStore({ storage });
    const user = loginUser("jane.doe", { createId: () => "user-1" });

    store.dispatch(loginSucceeded(user));

    const restored = createAppStore({ storage });
    hydrateStore(restored, storage);

    expect(restored.getState().auth).toEqual({
      user,
      isAuthenticated: true,
    });
  });

  it("clears persisted auth on logout", () => {
    const storage = new MemoryStorage();
    const store = createAppStore({ storage });
    store.dispatch(
      loginSucceeded({ id: "user-1", username: "jane.doe" }),
    );
    store.dispatch(logoutSucceeded());

    const restored = createAppStore({ storage });
    hydrateStore(restored, storage);

    expect(restored.getState().auth.isAuthenticated).toBe(false);
    expect(restored.getState().auth.user).toBeNull();
  });

  it("falls back safely when stored auth is malformed", () => {
    expect(parsePersistedAuth("{not json")).toEqual({
      user: null,
      isAuthenticated: false,
    });
    expect(parsePersistedAuth({ isAuthenticated: true, user: 12 })).toEqual({
      user: null,
      isAuthenticated: false,
    });
    expect(STORAGE_KEYS.auth).toBe("app.auth");
  });
});
