import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/domain/auth/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<AuthState>) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    loginSucceeded(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSucceeded() {
      return initialAuthState;
    },
  },
});

export const { hydrateAuth, loginSucceeded, logoutSucceeded } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
