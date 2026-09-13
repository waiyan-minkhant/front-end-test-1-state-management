"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Team } from "@/domain/teams/types";
import {
  createTeamFormSchema,
  type TeamFormValues,
} from "@/domain/teams/validators";
import { usePlayers } from "@/logic/hooks/usePlayers";
import { useTeams } from "@/logic/hooks/useTeams";
import { useAppSelector } from "@/logic/store/hooks";
import { selectUnavailablePlayerOwners } from "@/logic/selectors/teamSelectors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TeamPlayerSelector } from "@/components/teams/TeamPlayerSelector";

interface TeamFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team;
}

export function TeamFormModal({ open, onOpenChange, team }: TeamFormModalProps) {
  const { teams, create, update, status } = useTeams();
  const { catalog, catalogStatus, catalogError, ensureCatalog } = usePlayers();
  const unavailableByPlayerId = useAppSelector((state) =>
    selectUnavailablePlayerOwners(state, team?.id),
  );

  const schema = useMemo(
    () =>
      createTeamFormSchema({
        existingNames: teams.map((item) => item.name),
        currentName: team?.name,
      }),
    [team?.name, teams],
  );

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: team?.name ?? "",
      region: team?.region ?? "",
      country: team?.country ?? "",
      playerIds: team?.playerIds ?? [],
    },
  });

  useEffect(() => {
    if (open) {
      ensureCatalog();
      form.reset({
        name: team?.name ?? "",
        region: team?.region ?? "",
        country: team?.country ?? "",
        playerIds: team?.playerIds ?? [],
      });
    }
  }, [ensureCatalog, form, open, team]);

  function handleSubmit(values: TeamFormValues) {
    const result = team
      ? update(team.id, values)
      : create(values);

    if (!result.ok) {
      if (result.message.toLowerCase().includes("name")) {
        form.setError("name", { message: result.message });
      }
      form.setError("root", { message: result.message });
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle>{team ? "Edit team" : "Create team"}</DialogTitle>
          <DialogDescription>
            Team names must be unique. Player count is taken from the selected
            roster, and a player may belong to only one team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 flex-col gap-4 overflow-y-auto"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chicago Bulls" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="Midwest" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="playerIds"
              render={({ field }) => (
                <FormItem>
                  <TeamPlayerSelector
                    players={catalog}
                    selectedIds={field.value}
                    unavailableByPlayerId={unavailableByPlayerId}
                    onChange={field.onChange}
                    isLoading={catalogStatus === "loading"}
                    error={catalogError}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <DialogFooter className="shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={status === "mutating"}>
                {team ? "Save changes" : "Create team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
