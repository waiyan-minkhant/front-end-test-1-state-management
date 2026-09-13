import { StorageError } from "@/domain/common/errors";
import type { StorageService } from "@/data/storage/storageService";

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export class LocalStorageService implements StorageService {
  private readonly storage: Storage | null;
  private unavailable = false;

  constructor(storage: Storage | null = getBrowserStorage()) {
    this.storage = storage;
    this.unavailable = storage == null;
  }

  get isAvailable(): boolean {
    return this.storage != null && !this.unavailable;
  }

  get<T>(key: string): T | null {
    if (!this.storage) {
      return null;
    }

    try {
      const raw = this.storage.getItem(key);
      if (raw == null) {
        return null;
      }

      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storage) {
      this.unavailable = true;
      return;
    }

    try {
      this.storage.setItem(key, JSON.stringify(value));
      this.unavailable = false;
    } catch {
      this.unavailable = true;
    }
  }

  remove(key: string): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(key);
    } catch {
      this.unavailable = true;
    }
  }

  assertAvailable(): void {
    if (!this.isAvailable) {
      throw new StorageError();
    }
  }
}

export const localStorageService = new LocalStorageService();
