import { Skeleton } from "@/components/ui/skeleton";

export function LoadingFallback({ label = "Loading application" }: { label?: string }) {
  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
