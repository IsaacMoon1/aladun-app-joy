import { useSyncExternalStore } from "react";

export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
};

type AuthState = {
  user: AuthUser | null;
  hasAccount: boolean;
};

const STORAGE_KEY = "aladun_auth";
const ACCOUNT_KEY = "aladun_account";

function load(): AuthState {
  if (typeof window === "undefined") return { user: null, hasAccount: false };
  try {
    const acct = localStorage.getItem(ACCOUNT_KEY);
    const sess = localStorage.getItem(STORAGE_KEY);
    return {
      user: sess ? JSON.parse(sess) : null,
      hasAccount: !!acct,
    };
  } catch {
    return { user: null, hasAccount: false };
  }
}

let state: AuthState = { user: null, hasAccount: false };
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    state = load();
    hydrated = true;
  }
}

export const authStore = {
  getState: () => {
    ensureHydrated();
    return state;
  },
  subscribe: (l: () => void) => {
    ensureHydrated();
    listeners.add(l);
    return () => listeners.delete(l);
  },
  signUp: (user: AuthUser) => {
    state = { user, hasAccount: true };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    emit();
  },
  signIn: () => {
    const acct = localStorage.getItem(ACCOUNT_KEY);
    if (!acct) return false;
    const user = JSON.parse(acct) as AuthUser;
    state = { user, hasAccount: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    emit();
    return true;
  },
  signOut: () => {
    state = { user: null, hasAccount: !!localStorage.getItem(ACCOUNT_KEY) };
    localStorage.removeItem(STORAGE_KEY);
    emit();
  },
  hasAccount: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(ACCOUNT_KEY);
  },
};

export function useAuth() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    () => ({ user: null, hasAccount: false })
  );
}
