# Team Manager

Client-side team management app for a frontend state-management assessment.

Stack: Next.js App Router, TypeScript, Redux Toolkit, React-Redux, shadcn/ui, Tailwind CSS, Zod, and `localStorage`.

Player data is **synthetic and deterministic**. It does not come from `balldontlie.io`. The data layer is isolated so a live API adapter can replace the mock repository later without changing domain rules, Redux shape, or UI.

## Important notes

The provided URL was not working (it only returns the website's landing page with a 404), so mock player data is used instead.

## Commands

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

Four layers, one-way dependencies:

- **UI** — pages and components. No `localStorage`, repository, or business-rule code.
- **Logic** — Redux slices, selectors, hooks, and use-case services.
- **Data** — `PlayerRepository`, mock/API implementations, storage service.
- **Domain** — types, Zod validators, typed errors. No React.

```
UI → Logic → Data
       ↓
     Domain
```

## Folder structure

```
src/
  app/                 App Router entry, providers, styles
  components/          UI: auth, layout, players, teams, feedback, shadcn/ui
  domain/              Types, validators, errors
  logic/               Store, slices, selectors, hooks, services
  data/                Player repository, fixtures, storage
  lib/                 Constants and className helper
  tests/               Domain and logic unit tests
```

## Redux state

- `auth`: `{ user, isAuthenticated }`
- `teams`: `{ items, status, error }` — teams and `playerIds` are the ownership source of truth
- `players`: paginated listing plus an on-demand catalog for assignment

Modal open state, search text, and hover state stay in components.

## Persistence

`LocalStorageService` is the only `localStorage` access point.

- `app.auth` — authenticated user
- `app.teams` — teams and player assignments

Loading/error flags and the player listing cache are not persisted. The store hydrates after mount so SSR and the first client render stay aligned.

## Player repository

`MockPlayerRepository` is active. `ApiPlayerRepository` implements the same interface and is unused. Swap the implementation in `src/data/players/createPlayerRepository.ts`.

Each listing request returns **10** players. There are 80 deterministic fixtures.

## Business rules

Enforced in `teamService` and Zod, not only in the UI:

- Team names are unique after trim + case-insensitive compare
- A player belongs to at most one team
- Removing a player or deleting a team releases that player

## Errors

Expected failures render next to the relevant UI (duplicate name, fetch failure, storage unavailable). Unexpected render errors are caught by `ErrorBoundary` without showing stack traces.

## Performance

Infinite scroll uses `IntersectionObserver` plus a Load More button. Duplicate player requests are blocked in the thunk condition. Persistence writes only on auth and team actions.

## Testing

Vitest covers uniqueness, ownership, delete/release, auth rehydrate, and 10-per-page pagination.
