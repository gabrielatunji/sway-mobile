import { create } from 'zustand';

type User = { id: string; email?: string; address?: string } | null;

export type AuthState = {
  token: string | null;
  user: User;
  emailToVerify?: string;
  setAuth: (token: string, user: User) => void;
  setEmailToVerify: (email: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  emailToVerify: undefined,
  setAuth: (token: string, user: User) => set({ token, user }),
  setEmailToVerify: (email: string) => set({ emailToVerify: email }),
  clear: () => set({ token: null, user: null, emailToVerify: undefined }),
}));
