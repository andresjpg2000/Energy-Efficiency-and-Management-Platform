import { defineStore } from 'pinia'

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null,
    tokenTimer: null,
    userFetched: false, // prevent loop error when trying to fetch user data with a expired token
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.admin || false,
    getUsername: (state) => state.user?.name || null,
    getUserId: (state) => state.user?.id_user || null,
    getUserEmail: (state) => state.user?.email || null,
  },  
  actions: {
    async logout() {
      try {
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // User is not logged in
            this.user = null;
            this.userFetched = true;
            sessionStorage.setItem('isLoggedIn', 'false'); 
            return;
          }
          throw new Error('Failed to logout');
        }
        this.user = null;
        // Treat a logout as a fresh start
        sessionStorage.setItem('isLoggedIn', 'false'); 
      } catch (error) {
        console.log(error);
      } finally {
        this.userFetched = true;
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
    },
    async updateUser(userData) {
      const response = await fetch(`http://localhost:3000/users/${this.user.id_user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Failed to update user');
        error.status = response.status;
        error.details = errorData.details;
        throw error;
      }

      await this.fetchUser(); // await here to make sure it's done before UI update
  }


  },
})