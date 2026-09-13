"use client";

import { useCallback, useSyncExternalStore } from "react";
import { localStorageService } from "@/data/storage/localStorageService";
import type { StorageService } from "@/data/storage/storageService";

const emptySubscribe = () => () => undefined;

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function useLocalStorage(storage: StorageService = localStorageService) {
  const isClient = useIsClient();

  const getItem = useCallback(
    <T>(key: string) => (isClient ? storage.get<T>(key) : null),
    [isClient, storage],
  );

  const setItem = useCallback(
    <T>(key: string, value: T) => {
      if (isClient) {
        storage.set(key, value);
      }
    },
    [isClient, storage],
  );

  const removeItem = useCallback(
    (key: string) => {
      if (isClient) {
        storage.remove(key);
      }
    },
    [isClient, storage],
  );

  return {
    isClient,
    isAvailable: isClient && "isAvailable" in storage
      ? Boolean((storage as { isAvailable?: boolean }).isAvailable)
      : false,
    getItem,
    setItem,
    removeItem,
  };
}
