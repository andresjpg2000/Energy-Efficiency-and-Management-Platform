import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';
import { useMessagesStore } from './messages';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null, 
    userFetched: false, // Prevent loop error when trying to fetch user data with an expired token
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !state.isTokenExpired(),
    decodedToken: (state) => {
      if (!state.token) return null;
      try {
        return jwtDecode(state.token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    },
    isAdmin: (state) => state.user?.admin || false,
    getUsername: (state) => state.user?.name || null,
    getUserId: (state) => state.user?.id_user || null,
    getUserEmail: (state) => state.user?.email || null,
  },
  actions: {
    setUser(userData) {
      // Used in AuthLogin to read the token from the response
      this.token = userData.accessToken;
      this.user = userData.user;
      this.userFetched = true;
      // Set a timeout to clear the token when it expires
      try {
        const { exp } = this.decodedToken;
        if (!exp) {
          return;
        }
        const expirationTime = exp * 1000 - Date.now();
        setTimeout(() => {
          const messagesStore = useMessagesStore();
          messagesStore.add({
            color: 'error',
            text: 'Session expired, please login again',
          });
          this.clearToken();
          this.clearUser();
          this.logout();
          router.push({ name: 'login' });
        }, expirationTime);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    },
    clearToken() {
      // Reset token and clear it from session storage, used in logout
      this.token = null;
      sessionStorage.removeItem('token'); // Clear token from session storage
    },
    clearUser() {
      this.user = null;
      sessionStorage.removeItem('user');
    },
    isTokenExpired() {
      // Check if the token is expired
      if (!this.token) {
        return true;
      }
      try {
        const { exp } = this.decodedToken;
        if (!exp) {
          return true;
        }
        return Date.now() >= exp * 1000;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    },
    async logout() {
      const messagesStore = useMessagesStore();
      if (!this.token || this.isTokenExpired()) {
        this.clearToken();
        this.clearUser();
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token not valid on server
            this.clearToken();
            this.clearUser();
            return;
          }
          messagesStore.add({
            color: 'error',
            text: 'Failed to logout',
          });
          throw new Error('Failed to logout');
        }
        // Logout successful
        this.clearToken();
        this.clearUser();
        // Clear user data from session storage
        sessionStorage.removeItem('user');
        messagesStore.add({
          color: 'success',
          text: 'Logout successful',
        });
      } catch (error) {
        console.error(error);
        messagesStore.add({
          color: 'error',
          text: 'Failed to logout',
        });
      } 
    },
    updateUserState(updatedUser) {
      // Update the user state with the updated user data
      this.user = { ...this.user, ...updatedUser };
    }    
  },
  persist: {
    enabled: true,
    storage: sessionStorage,
    pick: ['user','token'],
  }
});