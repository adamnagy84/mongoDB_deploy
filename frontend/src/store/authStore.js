import { create } from "zustand";
import { api } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  //elso mount-kor, az app megproblja lekerni, hogy be vagyunk e jelentkezve

  init: async () => {
    try {
      const res = await api.me();
      set({ user: res.user, loading: false });
    } catch (error) {
      // 401 - nincs bejelentkezve --> teljesen OK.
      set({ user: null, loading: false });
    }
  },

  login: async (credentials) => {
    const res = await api.login(credentials);
    set({ user: res.user });
  },

  register: async (data) => {
    await api.register(data);
  },

  logout: async () => {
    await api.logout();
    set({ user: null });
  },
}));
