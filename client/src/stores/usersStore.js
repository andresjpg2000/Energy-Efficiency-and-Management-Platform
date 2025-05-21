import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
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
    setToken(token) {
      // Used in AuthLogin to read the token from the response and persist it
      this.token = token;
    },
    async logout() {
      try {
        if (!this.token || this.checkToken()) {
          this.clearUser();
          return;
        }
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            this.clearUser();
            return;
          }
          throw new Error('Failed to logout');
        }
        this.clearUser();
      } catch (error) {
        console.log(error);
      } finally {
        this.userFetched = true;
      }
    },
    async fetchUser() {
      if (!this.token || this.checkToken()) {
          this.clearUser();
          return false;
        }
      
      try {
        const response = await fetch('http://localhost:3000/auth/me', {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          this.clearUser();
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        this.user = data;
      } catch (error) {
        console.log(error);
        this.clearUser();
        return false;
      } finally {
        this.userFetched = true;
      }
    },
    checkToken() {
      if (!this.token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(this.token);
        if (!exp) {
          return true;
        }

        return Date.now() >= exp * 1000;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    },
    async updateUser(userData) {
      const response = await fetch(`http://localhost:3000/users/${this.user.id_user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${this.token}`,
        },
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
  },
  clearUser() {
    this.user = null;
    this.token = null;
    sessionStorage.removeItem('user');
  },
  },
  persist: {
    enabled: true,
    storage: sessionStorage,
    pick: ['user', 'token'],
  }
})