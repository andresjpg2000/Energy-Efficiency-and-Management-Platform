import { defineStore } from 'pinia'

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null,
    tokenTimer: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.admin || false,
    getUsername: (state) => state.user?.name || null,
    getUserId: (state) => state.user?.id_user || null,
  },  
  actions: {
    async logout() {
      try {
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to logout');
        }
        this.user = null;
        // Treat a logout as a fresh start
        sessionStorage.setItem('isLoggedIn', 'false'); 
      } catch (error) {
        console.log(error);
      }

    },
    async fetchUser() {
      try {
        const response = await fetch('http://localhost:3000/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          this.user = null;
          this.tokenTimer = null;
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        this.user = data;
        this.tokenTimer = Date.now();
      } catch (error) {
        console.log(error);
        this.user = null;
        this.tokenTimer = null;
        return false;
      }
    },
    checkToken() {
      const now = Date.now();
      const expirationTime = 60*60 *1000; // 1 hour
      return !this.tokenTimer || (now - this.tokenTimer) > expirationTime;
    }

  },
})