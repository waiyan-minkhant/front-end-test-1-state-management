import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";

export function TeamEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      title="No teams yet"
      description="Create a team, then assign players. Each player can belong to only one team."
      action={
        <Button type="button" onClick={onCreate}>
          Create team
        </Button>
      }
    />
  );
}
