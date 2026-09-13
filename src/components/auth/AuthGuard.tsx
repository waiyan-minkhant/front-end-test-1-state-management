"use client";

import type { ReactNode } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/logic/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return children;
}
