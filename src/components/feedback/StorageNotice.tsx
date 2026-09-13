"use client";

import { useLocalStorage } from "@/logic/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StorageNotice() {
  const { isClient, isAvailable } = useLocalStorage();

  if (!isClient || isAvailable) {
    return null;
  }

  return (
    <Alert>
      <AlertTitle>Local storage is unavailable</AlertTitle>
      <AlertDescription>
        Teams and sign-in will not persist after a reload in this browser
        session.
      </AlertDescription>
    </Alert>
  );
}
