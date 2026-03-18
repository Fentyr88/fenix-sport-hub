import { create } from "zustand";

const STORAGE_KEY = "fenix.auth.token";

type AuthStore = {
  token: string | null;
  setToken: (token: string | null) => void;
  clear: () => void;
};

function loadToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: loadToken(),
  setToken: (token) => {
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    set({ token });
  },
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ token: null });
  },
}));
