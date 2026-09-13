"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { matchesPlayerSearch } from "@/logic/selectors/playerSelectors";
import { useInfinitePlayers } from "@/logic/hooks/useInfinitePlayers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadMoreButton } from "@/components/players/LoadMoreButton";
import { PlayerListEmpty } from "@/components/players/PlayerListEmpty";
import { PlayerListError } from "@/components/players/PlayerListError";
import { PlayerListSkeleton } from "@/components/players/PlayerListSkeleton";
import { PlayerRow } from "@/components/players/PlayerRow";

export function PlayerList() {
  const {
    items,
    status,
    error,
    hasMore,
    loadMore,
    retry,
    sentinelRef,
  } = useInfinitePlayers();
  const [query, setQuery] = useState("");

  const visiblePlayers = useMemo(
    () => items.filter((player) => matchesPlayerSearch(player, query)),
    [items, query],
  );

  const isInitialLoading = status === "idle" || (status === "loading" && items.length === 0);
  const isLoadingMore = status === "loadingMore";

  return (
    <section
      aria-labelledby="players-heading"
      aria-busy={isInitialLoading || isLoadingMore}
      className="grid gap-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="players-heading" className="text-xl font-semibold">
            Players
          </h2>
          <p className="text-sm text-muted-foreground">
            Synthetic roster data, 10 players per request.
          </p>
        </div>
        <div className="grid w-full gap-2 sm:max-w-xs">
          <Label htmlFor="player-search">Search players</Label>
          <div className="relative">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="player-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="First or last name"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isInitialLoading ? <PlayerListSkeleton /> : null}

      {!isInitialLoading && error && items.length === 0 ? (
        <PlayerListError message={error} onRetry={retry} />
      ) : null}

      {!isInitialLoading && items.length === 0 && !error ? (
        <PlayerListEmpty description="The synthetic player source did not return any players." />
      ) : null}

      {items.length > 0 && visiblePlayers.length === 0 ? (
        <PlayerListEmpty
          title="No matching players"
          description="No loaded players match that name. Load more to search further down the roster."
        />
      ) : null}

      {visiblePlayers.length > 0 ? (
        <ul className="grid gap-2">
          {visiblePlayers.map((player) => (
            <li key={player.id}>
              <PlayerRow player={player} />
            </li>
          ))}
        </ul>
      ) : null}

      {error && items.length > 0 ? (
        <PlayerListError message={error} onRetry={retry} />
      ) : null}

      <div className="flex flex-col items-start gap-3">
        {hasMore && items.length > 0 ? (
          <LoadMoreButton
            onClick={loadMore}
            loading={isLoadingMore}
            disabled={isLoadingMore}
          />
        ) : null}
        {!hasMore && items.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            End of roster · {items.length} players loaded
          </p>
        ) : null}
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      </div>
    </section>
  );
}
