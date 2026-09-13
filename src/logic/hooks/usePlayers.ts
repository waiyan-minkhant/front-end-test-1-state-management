"use client";

import { useCallback } from "react";
import {
  selectCatalogError,
  selectCatalogStatus,
  selectLoadedPlayers,
  selectPlayerCatalog,
  selectPlayersError,
  selectPlayersHasMore,
  selectPlayersPage,
  selectPlayersStatus,
} from "@/logic/selectors/playerSelectors";
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks";
import {
  clearPlayersError,
  loadPlayerCatalog,
  loadPlayersPage,
} from "@/logic/store/slices/playersSlice";

export function usePlayers() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectLoadedPlayers);
  const catalog = useAppSelector(selectPlayerCatalog);
  const status = useAppSelector(selectPlayersStatus);
  const catalogStatus = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectPlayersError);
  const catalogError = useAppSelector(selectCatalogError);
  const hasMore = useAppSelector(selectPlayersHasMore);
  const page = useAppSelector(selectPlayersPage);

  const loadInitial = useCallback(() => {
    if (status === "idle" || (status === "failed" && items.length === 0)) {
      void dispatch(loadPlayersPage({ page: 1 }));
    }
  }, [dispatch, items.length, status]);

  const loadMore = useCallback(() => {
    if (!hasMore || status === "loading" || status === "loadingMore") {
      return;
    }

    void dispatch(loadPlayersPage({ page: page + 1 }));
  }, [dispatch, hasMore, page, status]);

  const retry = useCallback(() => {
    const nextPage = items.length === 0 ? 1 : page + 1;
    void dispatch(loadPlayersPage({ page: nextPage }));
  }, [dispatch, items.length, page]);

  const ensureCatalog = useCallback(() => {
    if (catalogStatus === "idle" || catalogStatus === "failed") {
      void dispatch(loadPlayerCatalog());
    }
  }, [catalogStatus, dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPlayersError());
  }, [dispatch]);

  return {
    items,
    catalog,
    status,
    catalogStatus,
    error,
    catalogError,
    hasMore,
    page,
    loadInitial,
    loadMore,
    retry,
    ensureCatalog,
    clearError,
  };
}
