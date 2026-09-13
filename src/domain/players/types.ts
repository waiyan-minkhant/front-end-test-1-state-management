export interface PlayerAffiliation {
  city: string;
  name: string;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  height?: string;
  affiliation?: PlayerAffiliation;
}

export interface PaginatedPlayers {
  data: Player[];
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

export interface PlayerListQuery {
  page: number;
  limit: number;
}
