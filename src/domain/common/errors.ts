export class AppError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class TeamNameAlreadyExistsError extends AppError {
  constructor(name: string) {
    super(`A team with this name already exists.`, "TEAM_NAME_ALREADY_EXISTS");
    this.details = { name };
  }

  readonly details: { name: string };
}

export class PlayerAlreadyAssignedError extends AppError {
  constructor(playerId: number, teamName?: string) {
    super(
      teamName
        ? `This player already belongs to ${teamName}.`
        : "This player already belongs to another team.",
      "PLAYER_ALREADY_ASSIGNED",
    );
    this.details = { playerId, teamName };
  }

  readonly details: { playerId: number; teamName?: string };
}

export class TeamNotFoundError extends AppError {
  constructor(teamId: string) {
    super("The requested team could not be found.", "TEAM_NOT_FOUND");
    this.details = { teamId };
  }

  readonly details: { teamId: string };
}

export class PlayerNotFoundError extends AppError {
  constructor(playerId: number) {
    super("The requested player could not be found.", "PLAYER_NOT_FOUND");
    this.details = { playerId };
  }

  readonly details: { playerId: number };
}

export class StorageError extends AppError {
  constructor(message = "Local storage is unavailable.") {
    super(message, "STORAGE_UNAVAILABLE");
  }
}

export class PlayerFetchError extends AppError {
  constructor(message = "Unable to load players.") {
    super(message, "PLAYER_FETCH_FAILED");
  }
}

export class InvalidUsernameError extends AppError {
  constructor(message: string) {
    super(message, "INVALID_USERNAME");
  }
}

export class InvalidTeamDataError extends AppError {
  constructor(message: string) {
    super(message, "INVALID_TEAM_DATA");
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
