import { EmptyState } from "@/components/feedback/EmptyState";

export function PlayerListEmpty({
  title = "No players to show",
  description = "There are no players in the current list.",
}: {
  title?: string;
  description?: string;
}) {
  return <EmptyState title={title} description={description} />;
}
