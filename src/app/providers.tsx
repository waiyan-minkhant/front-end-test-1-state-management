"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { LoadingFallback } from "@/components/feedback/LoadingFallback";
import { createAppStore, hydrateStore, type AppStore } from "@/logic/store";

const emptySubscribe = () => () => undefined;

function createHydratedStore(): AppStore {
  const store = createAppStore();
  hydrateStore(store);
  return store;
}

export function Providers({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const store = useMemo(
    () => (isClient ? createHydratedStore() : createAppStore()),
    [isClient],
  );

  return (
    <Provider store={store}>
      <ErrorBoundary>
        {isClient ? children : <LoadingFallback />}
      </ErrorBoundary>
    </Provider>
  );
}
