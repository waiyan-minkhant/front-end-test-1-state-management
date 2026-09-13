import { Skeleton } from "@/components/ui/skeleton";

export function PlayerListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-2" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}
