import type { User } from "firebase/auth";
import { writable } from "svelte/store";

const authStore = writable<AuthStore>({
  isLoggedIn: false,
})

interface AuthStore {
  isLoggedIn: boolean;
  user?: AuthUser
}

export function updateAuthStore(value: AuthStore) {
  authStore.set(value)
}

export type AuthUser = User | null;
export const authStoreSub = authStore.subscribe;