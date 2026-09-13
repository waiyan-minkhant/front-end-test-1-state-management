"use client";

import { getErrorMessage } from "@/domain/common/errors";
import { loginUser, logoutUser } from "@/logic/services/authService";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/logic/selectors/authSelectors";
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks";
import {
  loginSucceeded,
  logoutSucceeded,
} from "@/logic/store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  function login(username: string) {
    try {
      const nextUser = loginUser(username);
      dispatch(loginSucceeded(nextUser));
      return { ok: true as const, user: nextUser };
    } catch (error) {
      return {
        ok: false as const,
        message: getErrorMessage(error, "Unable to sign in."),
      };
    }
  }

  function logout() {
    logoutUser();
    dispatch(logoutSucceeded());
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
