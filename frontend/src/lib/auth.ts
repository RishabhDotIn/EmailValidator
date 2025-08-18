import { atom } from 'jotai';
import { setAuthToken } from './api';

const TOKEN_KEY = 'ev_access_token';

export const accessTokenAtom = atom<string | null>(null);

export function loadTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) setAuthToken(t);
  return t;
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  setAuthToken(token);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  setAuthToken(undefined);
}
