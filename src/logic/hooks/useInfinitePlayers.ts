"use client";

import { useEffect, useRef } from "react";
import { usePlayers } from "@/logic/hooks/usePlayers";

export function useInfinitePlayers() {
  const players = usePlayers();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { loadInitial, loadMore } = players;

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  return {
    ...players,
    sentinelRef,
  };
}
