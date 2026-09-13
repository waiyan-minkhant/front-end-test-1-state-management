export type AsyncStatus =
  | "idle"
  | "loading"
  | "loadingMore"
  | "succeeded"
  | "failed";

export type MutationStatus = "idle" | "ready" | "mutating" | "failed";
