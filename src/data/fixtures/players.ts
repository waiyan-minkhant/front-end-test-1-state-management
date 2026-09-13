import type { Player, PlayerAffiliation } from "@/domain/players/types";

const FIRST_NAMES = [
  "Marcus",
  "Elena",
  "Jamal",
  "Sofia",
  "Andre",
  "Priya",
  "Noah",
  "Amara",
  "Leo",
  "Keisha",
  "Diego",
  "Hannah",
  "Malik",
  "Ivy",
  "Owen",
  "Nia",
] as const;

const LAST_NAMES = [
  "Carter",
  "Nguyen",
  "Brooks",
  "Patel",
  "Reyes",
  "Sullivan",
  "Okoye",
  "Bennett",
  "Nakamura",
  "Walsh",
  "Ibrahim",
  "Foster",
  "Kowalski",
  "Diaz",
  "Singh",
  "Coleman",
] as const;

const POSITIONS = ["PG", "SG", "SF", "PF", "C"] as const;

const HEIGHTS = [
  "5-11",
  "6-1",
  "6-3",
  "6-5",
  "6-7",
  "6-8",
  "6-10",
  "7-0",
] as const;

const AFFILIATIONS: PlayerAffiliation[] = [
  { city: "Chicago", name: "Northside" },
  { city: "Boston", name: "Harbor" },
  { city: "Los Angeles", name: "Pacific" },
  { city: "Miami", name: "Tide" },
  { city: "Denver", name: "Altitude" },
  { city: "Seattle", name: "Sound" },
  { city: "Austin", name: "Horizon" },
  { city: "Detroit", name: "Motor" },
  { city: "Atlanta", name: "Peachtree" },
  { city: "Phoenix", name: "Sunbelt" },
];

const PLAYER_COUNT = 80;

export const PLAYER_FIXTURES: Player[] = Array.from(
  { length: PLAYER_COUNT },
  (_, index) => {
    const id = index + 1;
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastName =
      LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];

    return {
      id,
      firstName,
      lastName,
      position: POSITIONS[index % POSITIONS.length],
      height: HEIGHTS[index % HEIGHTS.length],
      affiliation: AFFILIATIONS[index % AFFILIATIONS.length],
    };
  },
);
