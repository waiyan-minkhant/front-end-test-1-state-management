import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "The page could not be displayed. Try again.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg items-center px-4">
      <Alert variant="destructive" className="w-full">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-3">
          <p>{message}</p>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    </div>
  );
}
