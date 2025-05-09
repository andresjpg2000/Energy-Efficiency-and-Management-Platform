import { defineStore } from 'pinia'

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isAdmin: (state) => state.user?.admin ?? false,
    userId: (state) => state.user?.id_user ?? null,
    userName: (state) => state.user?.name ?? null,
    userEmail: (state) => state.user?.email ?? null,
  },
  actions: {
    login(data) {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    },
    logout() {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  },
})