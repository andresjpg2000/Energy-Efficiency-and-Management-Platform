import { defineStore } from 'pinia'

export const useUsersStore = defineStore('user', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    getToken: (state) => state.token,
    decodedToken: (state) => {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        return payload;
      }
      return null;
    },
    isAdmin: (state) => {
      const payload = state.decodedToken;
      if (payload) {
        return payload.admin;
      }
      return false;
    },
    userName: (state) => {
      const payload = state.decodedToken;
      if (payload) {
        return payload.name;
      }
      return null;
    },
    userId: (state) => {
      const payload = state.decodedToken;
      if (payload) {
        return payload.id_user;
      }
      return null;
    },
    userEmail: (state) => {
      const payload = state.decodedToken;
      if (payload) {
        return payload.email;
      }
      return null;
    },
  },
  actions: {
    login(data) {
      sessionStorage.setItem('token', data.token);
      this.token = data.token;
    },
    logout() {
      sessionStorage.removeItem('token');
      this.token = null;
    }
  },
})