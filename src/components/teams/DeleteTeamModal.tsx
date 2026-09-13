"use client";

import type { Team } from "@/domain/teams/types";
import { useTeams } from "@/logic/hooks/useTeams";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteTeamModalProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTeamModal({
  team,
  open,
  onOpenChange,
}: DeleteTeamModalProps) {
  const { remove, status, error } = useTeams();

  function handleDelete() {
    if (!team) {
      return;
    }

    const result = remove(team.id);
    if (result.ok) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {team?.name ?? "team"}?</DialogTitle>
          <DialogDescription>
            This removes the team. Assigned players will become available again
            and can be added to another team.
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!team || status === "mutating"}
            onClick={handleDelete}
          >
            Delete team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
