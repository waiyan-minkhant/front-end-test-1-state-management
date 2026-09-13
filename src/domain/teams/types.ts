export interface Team {
  id: string;
  name: string;
  region: string;
  country: string;
  playerIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamFormData {
  name: string;
  region: string;
  country: string;
  playerIds: number[];
}
