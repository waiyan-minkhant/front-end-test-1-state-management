import { InvalidUsernameError } from "@/domain/common/errors";
import type { User } from "@/domain/auth/types";
import { usernameSchema } from "@/domain/auth/validators";

export interface AuthServiceOptions {
  createId?: () => string;
}

export function loginUser(
  username: string,
  options: AuthServiceOptions = {},
): User {
  const parsed = usernameSchema.safeParse(username);

  if (!parsed.success) {
    throw new InvalidUsernameError(
      parsed.error.issues[0]?.message ?? "Username is invalid.",
    );
  }

  const createId = options.createId ?? (() => crypto.randomUUID());

  return {
    id: createId(),
    username: parsed.data,
  };
}

export function logoutUser(): null {
  return null;
}
